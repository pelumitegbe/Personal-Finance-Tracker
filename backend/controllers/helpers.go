package controllers

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

func getUserIdFromRequest(c *gin.Context) (uuid.UUID, string) {
	var msg string
	// get user id
	uid, exists := c.Get("uid")
	if !exists || uid == "" {
		msg = "User Id not found"
		return uuid.UUID{}, msg
	}

	// Type assert uid to a string
	userIdStr, ok := uid.(string)
	if !ok {
		msg = "Invalid user id"
		return uuid.UUID{}, msg
	}

	// parse user id into uuid
	user_id, err := uuid.Parse(userIdStr)
	if err != nil {
		msg = "Internal server error"
		return uuid.UUID{}, msg
	}
	return user_id, ""
}

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

// create a response for the transactions
func createTransactionsResponse(data interface{}) models.TransactionResponse {
	return models.TransactionResponse{
		Status: "Success",
		Data:   data,
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
