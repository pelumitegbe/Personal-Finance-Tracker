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

func Login(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// getting the data from request body and validating it
		validate := validator.New()
		var userDetails models.User
		if err := c.BindJSON(&userDetails); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}
		err := validate.Struct(userDetails)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// check if user exists or not
		userExists, err := CheckUserExists(db, userDetails.Username, userDetails.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while fetching user"})
			return
		}
		if !userExists {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// get user
		var user database.User
		user, err = db.GetUserByUsernameOrEmail(ctx, database.GetUserByUsernameOrEmailParams{
			Username: userDetails.Username,
			Email:    userDetails.Email,
		})
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Error while fetching user"},
			)
			return
		}

		// verifying if the password provided is same or not
		err = VerifyPassword(user.Password, userDetails.Password)
		if err != nil {
			c.JSON(
				http.StatusUnauthorized,
				gin.H{"error": "Invalid credentials! username and password doesn't match"},
			)
			return
		}

		c.JSON(http.StatusOK, createUserResponse(user))
	}
}
