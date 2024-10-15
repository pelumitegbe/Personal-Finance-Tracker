package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

func Signup(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		validate := validator.New()

		var user models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// validating Struct
		validationError := validate.Struct(user)
		if validationError != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// checking if the username or email already exists
		userExists, err := CheckUserExists(db, user.Username, user.Email)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Error while checking users existence"},
			)
			return
		}
		if userExists {
			c.JSON(http.StatusConflict, gin.H{"Error": "Email or username already in use"})
			return
		}

		// hashing our password
		hashedPassword, err := HashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while hashing password!"})
			return
		}

		// push the user data into the database and create user
		userParams := database.CreateUserParams{
			ID:        uuid.New(),
			Username:  user.Username,
			Email:     user.Email,
			Password:  hashedPassword,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		err = db.CreateUser(ctx, userParams)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		c.JSON(http.StatusCreated, gin.H{"Success": "User created successfully"})
	}
}

func Login() gin.HandlerFunc {
	return func(ctx *gin.Context) {
	}
}
