package controllers_test

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pelumitegbe/Personal-Finance-Tracker/controllers"
	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockDB is the mock database used for testing.
type MockDB struct {
	mock.Mock
}

// Implement the methods required by the database interface
func (m *MockDB) AddTransactions(ctx context.Context, params database.AddTransactionsParams) (database.Transaction, error) {
	args := m.Called(ctx, params)
	return args.Get(0).(database.Transaction), args.Error(1)
}

func (m *MockDB) GetCategory(ctx context.Context, categoryName string) (database.Category, error) {
	args := m.Called(ctx, categoryName)
	return args.Get(0).(database.Category), args.Error(1)
}

// Test case for AddTransaction handler
func TestAddTransaction_Success(t *testing.T) {
	mockDB := new(MockDB)
	router := gin.Default()

	// Mock category retrieval
	mockCategory := database.Category{ID: uuid.New(), Name: "Food"}
	mockDB.On("GetCategory", mock.Anything, "Food").Return(mockCategory, nil)

	// Mock transaction creation
	mockTransaction := database.Transaction{
		ID:              uuid.New(),
		Amount:          "100.00",
		Description:     sql.NullString{String: "Groceries", Valid: true},
		CategoriesID:    mockCategory.ID,
		UserID:          uuid.New(),
		TransactionType: "Credit",
		TransactionDate: time.Now(),
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}
	mockDB.On("AddTransactions", mock.Anything, mock.Anything).Return(mockTransaction, nil)

	// AddTransaction route handler
	router.POST("/transactions", controllers.AddTransaction(mockDB))

	// Create request payload
	transaction := models.Transaction{
		Amount:          "100.00",
		Description:     sql.NullString{String: "Groceries", Valid: true},
		TransactionType: "Credit",
		Category:        "Food",
	}
	body, err := json.Marshal(transaction)
	if err != nil {
		t.Fatalf("Failed to marshal transaction: %v", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", "/transactions", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert success response
	assert.Equal(t, http.StatusCreated, w.Code)
	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}
	assert.Equal(t, "100.00", response["amount"])
	assert.Equal(t, "Credit", response["transaction_type"])
}

// Test case for invalid request body
func TestAddTransaction_InvalidRequestBody(t *testing.T) {
	mockDB := new(MockDB)
	router := gin.Default()
	router.POST("/transactions", controllers.AddTransaction(mockDB))

	// Create an invalid JSON request payload
	body := []byte(`{invalid_json}`)

	// Create HTTP request
	req, err := http.NewRequest("POST", "/transactions", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert bad request
	assert.Equal(t, http.StatusBadRequest, w.Code)
	var response map[string]string
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}
	assert.Equal(t, "Request body not valid", response["error"])
}

// Test case for invalid category
func TestAddTransaction_InvalidCategory(t *testing.T) {
	mockDB := new(MockDB)
	router := gin.Default()

	// Mock category retrieval failure
	mockDB.On("GetCategory", mock.Anything, "InvalidCategory").Return(database.Category{}, sql.ErrNoRows)

	router.POST("/transactions", controllers.AddTransaction(mockDB))

	// Create request payload with an invalid category
	transaction := models.Transaction{
		Amount:          "50.00",
		TransactionType: "Debit",
		Description:     sql.NullString{String: "Utilities", Valid: true},
		Category:        "InvalidCategory",
	}
	body, err := json.Marshal(transaction)
	if err != nil {
		t.Fatalf("Failed to marshal transaction: %v", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", "/transactions", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert error for invalid category
	assert.Equal(t, http.StatusBadRequest, w.Code)
	var response map[string]string
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}
	assert.Equal(t, "Provide valid category type", response["error"])
}

// Test case for unauthorized access
func TestAddTransaction_Unauthorized(t *testing.T) {
	mockDB := new(MockDB)
	router := gin.Default()

	router.POST("/transactions", controllers.AddTransaction(mockDB))

	// Create request payload
	transaction := models.Transaction{
		Amount:          "100.00",
		TransactionType: "Credit",
		Description:     sql.NullString{String: "Groceries", Valid: true},
		Category:        "Food",
	}
	body, err := json.Marshal(transaction)
	if err != nil {
		t.Fatalf("Failed to marshal transaction: %v", err)
	}

	// Create HTTP request without authorization
	req, err := http.NewRequest("POST", "/transactions", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert unauthorized response
	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var response map[string]string
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}
	assert.Equal(t, "error", response["error"])
}
