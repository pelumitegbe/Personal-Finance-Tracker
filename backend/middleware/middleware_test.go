package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"github.com/gin-gonic/gin"
	"github.com/pelumitegbe/Personal-Finance-Tracker/tokens"
)

func TestAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)
	// Mock a function to generate a valid access token
	validToken, _ := tokens.GenerateAccessToken(
		"test@example.com",
		"Test",
		"User",
		"testuser",
		"12345",
		"user",
	)
	invalidToken := "invalidtoken"
	refreshToken, _ := tokens.GenerateRefreshToken(
		"test@example.com",
		"Test",
		"User",
		"testuser",
		"12345",
		"user",
	)
	tests := []struct {
		name           string
		token          string
		expectedStatus int
		expectedError  string
	}{
		{"No Token Provided", "", http.StatusUnauthorized, "No authorization header provided"},
		{
			"Invalid Token",
			invalidToken,
			http.StatusUnauthorized,
			"token contains an invalid number of segments",
		},
		{
			"Refresh Token Provided",
			refreshToken,
			http.StatusUnauthorized,
			"Invalid token type! Token must be access",
		},
		{"Valid Access Token", validToken, http.StatusOK, ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set up the Gin router with the Authentication middleware
			r := gin.Default()
			r.Use(Authentication())
			r.GET("/test", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Authorized"})
			})
			// Create a test request with the specified token
			req, _ := http.NewRequest("GET", "/test", nil)
			if tt.token != "" {
				req.Header.Set("token", tt.token)
			}
			w := httptest.NewRecorder()

			// Perform the test request
			r.ServeHTTP(w, req)
			// Assert the response status and error message
			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, but got %d", tt.expectedStatus, w.Code)
			}
			if tt.expectedError != "" && !strings.Contains(w.Body.String(), tt.expectedError) {
				t.Errorf(
					"Expected error message to contain '%s', but got '%s'",
					tt.expectedError,
					w.Body.String(),
				)
			}
		})
	}
}

func TestAdminAuthorization(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		name           string
		role           interface{}
		expectedStatus int
		expectedError  string
	}{
		{"No Role Provided", nil, http.StatusUnauthorized, "You are not authorized"},
		{"Non-Admin Role", "user", http.StatusUnauthorized, "You are not authorized"},
		{"Admin Role", "admin", http.StatusOK, ""},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set up the Gin router with the AdminAuthorization middleware
			r := gin.Default()
			r.Use(func(c *gin.Context) {
				if tt.role != nil {
					c.Set("role", tt.role)
				}
				c.Next()
			}, AdminAuthorizaton())
			r.GET("/admin", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Authorized as admin"})
			})
			// Create a test request
			req, _ := http.NewRequest("GET", "/admin", nil)
			w := httptest.NewRecorder()

			// Perform the test request
			r.ServeHTTP(w, req)

			// Assert the response status and error message
			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, but got %d", tt.expectedStatus, w.Code)
			}
			if tt.expectedError != "" && !strings.Contains(w.Body.String(), tt.expectedError) {
				t.Errorf(
					"Expected error message to contain '%s', but got '%s'",
					tt.expectedError,
					w.Body.String(),
				)
			}
		})
	}
}