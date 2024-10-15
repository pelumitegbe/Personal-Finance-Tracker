package controllers

import (
	"context"
	"database/sql"

	"golang.org/x/crypto/bcrypt"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
)

// function to hashpassword
func HashPassword(password string) (string, error) {
	bytePassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func VerifyPassword(userPassword, givenPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(givenPassword))
}

// function to check if a user with provided email or username exists or not
func CheckUserExists(db *database.Queries, username string, email string) (bool, error) {
	userExists := database.CheckUserExistsParams{
		Email:    email,
		Username: username,
	}
	exists, err := db.CheckUserExists(context.Background(), userExists)
	if err != nil {
		return false, err
	}
	return exists, err
}

// convert string to NullString
func ToNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{
			String: s,
			Valid:  false,
		}
	}
	return sql.NullString{
		String: s,
		Valid:  true,
	}
}
