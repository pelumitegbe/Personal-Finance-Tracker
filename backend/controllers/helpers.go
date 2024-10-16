package controllers

import (
	"context"
	"database/sql"

	"golang.org/x/crypto/bcrypt"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
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

// create a response for user login
func createUserResponse(user database.User) any {
	return map[string]interface{}{
		"status": "success",
		"user": models.UserResponse{
			ID:           user.ID,
			Username:     user.Username,
			FirstName:    user.FirstName,
			LastName:     user.LastName,
			Email:        user.Email,
			Role:         user.Role,
			Token:        user.Token.String,
			RefreshToken: user.RefreshToken.String,
			CreatedAt:    user.CreatedAt,
			UpdatedAt:    user.UpdatedAt,
		},
	}
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
