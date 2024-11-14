package controllers

import (
	"database/sql"
	"testing"

	"golang.org/x/crypto/bcrypt"
)

// Test case for HashPassword function
func TestHashPassword(t *testing.T) {
	password := "securepassword"

	// Hash the password
	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Errorf("Expected no error when hashing password, but got %v", err)
	}
	if hashedPassword == "" {
		t.Error("Expected a non-empty hashed password")
	}

	// Verify that the hashed password matches the original password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		t.Error("Expected hashed password to match the original password")
	}
}

// Test case for VerifyPassword function
func TestVerifyPassword(t *testing.T) {
	password := "securepassword"

	// Hash the password for testing
	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Errorf("Expected no error when hashing password, but got %v", err)
	}

	// Case 1: Correct password
	err = VerifyPassword(hashedPassword, password)
	if err != nil {
		t.Error("Expected correct password verification to succeed")
	}

	// Case 2: Incorrect password
	err = VerifyPassword(hashedPassword, "wrongpassword")
	if err == nil {
		t.Error("Expected incorrect password verification to fail")
	}
}

// Test case for ToNullString function
func TestToNullString(t *testing.T) {
	tests := []struct {
		input    string
		expected sql.NullString
	}{
		{"", sql.NullString{String: "", Valid: false}},
		{"hello", sql.NullString{String: "hello", Valid: true}},
	}

	for _, test := range tests {
		result := ToNullString(test.input)
		if result != test.expected {
			t.Errorf("Expected %v, but got %v", test.expected, result)
		}
	}
}
