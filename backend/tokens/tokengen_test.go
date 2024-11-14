// controllers/token_test.go
package tokens

import (
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func TestMain(m *testing.M) {
	// Set up test environment
	os.Setenv("SECRET_KEY", "test-secret-key")
	code := m.Run()
	os.Exit(code)
}

func TestGenerateAccessToken(t *testing.T) {
	tests := []struct {
		name      string
		email     string
		firstName string
		lastName  string
		username  string
		uid       string
		role      string
		wantErr   bool
	}{
		{
			name:      "valid token generation",
			email:     "test@example.com",
			firstName: "John",
			lastName:  "Doe",
			username:  "johndoe",
			uid:       "123",
			role:      "user",
			wantErr:   false,
		},
		{
			name:      "empty username",
			email:     "test@example.com",
			firstName: "John",
			lastName:  "Doe",
			username:  "",
			uid:       "123",
			role:      "user",
			wantErr:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, err := GenerateAccessToken(
				tt.email,
				tt.firstName,
				tt.lastName,
				tt.username,
				tt.uid,
				tt.role,
			)
			if (err != nil) != tt.wantErr {
				t.Errorf("GenerateAccessToken() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && token == "" {
				t.Error("GenerateAccessToken() returned empty token")
			}
		})
	}
}

func TestTokenGenerator(t *testing.T) {
	tests := []struct {
		name      string
		email     string
		firstName string
		lastName  string
		username  string
		uid       string
		role      string
		wantErr   bool
	}{
		{
			name:      "valid tokens generation",
			email:     "test@example.com",
			firstName: "John",
			lastName:  "Doe",
			username:  "johndoe",
			uid:       "123",
			role:      "user",
			wantErr:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			accessToken, refreshToken, err := TokenGenerator(
				tt.email,
				tt.firstName,
				tt.lastName,
				tt.username,
				tt.uid,
				tt.role,
			)
			if (err != nil) != tt.wantErr {
				t.Errorf("TokenGenerator() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr {
				if accessToken == "" {
					t.Error("TokenGenerator() returned empty access token")
				}
				if refreshToken == "" {
					t.Error("TokenGenerator() returned empty refresh token")
				}
				if accessToken == refreshToken {
					t.Error("TokenGenerator() access and refresh tokens are identical")
				}
			}
		})
	}
}

func TestValidateToken(t *testing.T) {
	// Helper function to generate test token
	generateTestToken := func(expiresIn time.Duration) string {
		email := "test@example.com"
		firstName := "John"
		lastName := "Doe"
		username := "johndoe"
		uid := "123"
		role := "user"

		claims := &SignedDetails{
			Token_Type: "access",
			Email:      email,
			Username:   username,
			First_Name: firstName,
			Last_Name:  lastName,
			Uid:        uid,
			Role:       role,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiresIn)),
				Subject:   username,
				Issuer:    "finance-tracker",
			},
		}

		token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).
			SignedString([]byte(SECRET_KEY))
		return token
	}

	tests := []struct {
		name       string
		token      string
		wantValid  bool
		wantErrMsg string
	}{
		{
			name:       "valid token",
			token:      generateTestToken(time.Hour),
			wantValid:  true,
			wantErrMsg: "",
		},
		{
			name:       "expired token",
			token:      generateTestToken(-time.Hour),
			wantValid:  false,
			wantErrMsg: "token is already expired",
		},
		{
			name:       "invalid token format",
			token:      "invalid.token.format",
			wantValid:  false,
			wantErrMsg: "token contains an invalid number of segments",
		},
		{
			name:       "empty token",
			token:      "",
			wantValid:  false,
			wantErrMsg: "token contains an invalid number of segments",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			claims, msg := ValidateToken(tt.token)
			if tt.wantValid {
				if claims == nil {
					t.Error("ValidateToken() returned nil claims for valid token")
				}
				if msg != tt.wantErrMsg {
					t.Errorf(
						"ValidateToken() returned unexpected error message = %v, want %v",
						msg,
						tt.wantErrMsg,
					)
				}
			} else {
				if claims != nil {
					t.Error("ValidateToken() returned claims for invalid token")
				}
				if msg == "" {
					t.Error("ValidateToken() didn't return error message for invalid token")
				}
			}
		})
	}
}

func TestGetClaims(t *testing.T) {
	testEmail := "test@example.com"
	testFirstName := "John"
	testLastName := "Doe"
	testUsername := "johndoe"
	testUid := "123"
	testRole := "user"

	// Generate a valid token for testing
	validToken, _ := GenerateAccessToken(
		testEmail,
		testFirstName,
		testLastName,
		testUsername,
		testUid,
		testRole,
	)

	tests := []struct {
		name      string
		token     string
		wantEmail string
		wantValid bool
	}{
		{
			name:      "valid token",
			token:     validToken,
			wantEmail: testEmail,
			wantValid: true,
		},
		{
			name:      "invalid token",
			token:     "invalid.token.format",
			wantEmail: "",
			wantValid: false,
		},
		{
			name:      "empty token",
			token:     "",
			wantEmail: "",
			wantValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			claims, msg := GetClaims(tt.token)

			if tt.wantValid {
				if claims == nil {
					t.Error("GetClaims() returned nil claims for valid token")
				}
				if msg != "" {
					t.Errorf("GetClaims() returned unexpected error message: %v", msg)
				}
				if claims != nil && claims.Email != tt.wantEmail {
					t.Errorf(
						"GetClaims() returned wrong email = %v, want %v",
						claims.Email,
						tt.wantEmail,
					)
				}
			} else {
				if claims != nil {
					t.Error("GetClaims() returned claims for invalid token")
				}
				if msg == "" {
					t.Error("GetClaims() didn't return error message for invalid token")
				}
			}
		})
	}
}
