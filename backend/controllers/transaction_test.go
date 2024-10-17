package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestAddTransaction(t *testing.T) {
	// Setup the router and database
	gin.SetMode(gin.TestMode)
	router := setupRouter()

	// Test cases
	tests := []struct {
		name           string
		payload        string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "Valid Transaction",
			payload:        `{"amount": 100.5, "category": "Groceries", "description": "Weekly groceries", "date": "2024-10-01 15:00:00"}`,
			expectedStatus: http.StatusOK,
			expectedBody:   "Transaction added successfully!",
		},
		{
			name:           "Missing Amount",
			payload:        `{"category": "Groceries", "description": "Weekly groceries", "date": "2024-10-01 15:00:00"}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "Key: 'Transaction.Amount' Error:Field validation for 'Amount' failed on the 'required' tag",
		},
		{
			name:           "Negative Amount",
			payload:        `{"amount": -50, "category": "Groceries", "description": "Refund", "date": "2024-10-01 15:00:00"}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "Key: 'Transaction.Amount' Error:Field validation for 'Amount' failed on the 'gt' tag",
		},
	}

	// Iterate through test cases
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a new HTTP request with the payload
			req, _ := http.NewRequest(http.MethodPost, "/add-transaction", bytes.NewBufferString(tt.payload))
			req.Header.Set("Content-Type", "application/json")

			// Record the HTTP response
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			// Assert the status code and response body
			assert.Equal(t, tt.expectedStatus, w.Code)
			assert.Contains(t, w.Body.String(), tt.expectedBody)
		})
	}
}

// setupRouter initializes the router with the necessary routes for testing
func setupRouter() *gin.Engine {
	router := gin.Default()

	// Setup an in-memory SQLite database for testing
	db, _ = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&Transaction{})

	router.POST("/add-transaction", addTransaction)
	return router
}
