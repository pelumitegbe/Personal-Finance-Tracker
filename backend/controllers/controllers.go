package controllers

<<<<<<< HEAD
// import (
// 	"net/http"
<<<<<<< HEAD

// 	"models"

// 	"github.com/gin-gonic/gin"
// )

// func GetUser(c *gin.Context) {
// 	id := c.Param("id")
// 	user, found := models.GetUserByID(id)

=======
//
// 	"github.com/gin-gonic/gin"
// )
//
// func GetUser(c *gin.Context) {
// 	id := c.Param("id")
// 	user, found := models.GetUserByID(id)
//
>>>>>>> 00ba90e74b5c0a3bc267b6dc8bc0cc52090081a2
// 	if !found {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
// 		return
// 	}
<<<<<<< HEAD

// 	c.JSON(http.StatusOK, user)
// }

// func CreateUser(c *gin.Context) {
// 	var newUser models.User

=======
//
// 	c.JSON(http.StatusOK, user)
// }
//
// func CreateUser(c *gin.Context) {
// 	var newUser models.User
//
>>>>>>> 00ba90e74b5c0a3bc267b6dc8bc0cc52090081a2
// 	if err := c.ShouldBindJSON(&newUser); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
<<<<<<< HEAD

// 	models.CreateUser(newUser)

=======
//
// 	models.CreateUser(newUser)
//
>>>>>>> 00ba90e74b5c0a3bc267b6dc8bc0cc52090081a2
// 	c.JSON(http.StatusCreated, newUser)
// }
=======
import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
	"github.com/pelumitegbe/Personal-Finance-Tracker/tokens"
)

func UpdateToken(
	db *database.Queries,
	signedToken, signedRefreshToken, userid string,
) (database.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	id, err := uuid.Parse(userid)
	if err != nil {
		return database.User{}, err
	}
	token := ToNullString(signedToken)
	refreshToken := ToNullString(signedRefreshToken)
	updateTokenParams := database.UpdateUserTokensParams{
		ID:           id,
		Token:        token,
		RefreshToken: refreshToken,
		UpdatedAt:    time.Now(),
	}
	// update token and refresh token
	user, err := db.UpdateUserTokens(ctx, updateTokenParams)
	if err != nil {
		return database.User{}, err
	}
	return user, nil
}

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
		if user.Role == "" {
			user.Role = "user"
		}
		userParams := database.CreateUserParams{
			ID:        uuid.New(),
			Username:  user.Username,
			Email:     user.Email,
			Password:  hashedPassword,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Role:      user.Role,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		// store the user information in the database
		err = db.CreateUser(ctx, userParams)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		// generate jwt token
		token, refresh_token, err := tokens.TokenGenerator(
			userParams.Email,
			userParams.FirstName,
			userParams.LastName,
			userParams.Username,
			userParams.ID.String(),
			userParams.Role,
		)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		// save the token in the database
		newUser, err := UpdateToken(db, token, refresh_token, userParams.ID.String())
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		// user successfully created and return the response
		c.JSON(http.StatusCreated, createUserResponse(newUser))
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

		// generating access token and refresh token
		token, refresh_token, err := tokens.TokenGenerator(
			user.Email,
			user.FirstName,
			user.LastName,
			user.Username,
			user.ID.String(),
			user.Role,
		)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		// updating the token to the database
		newUser, err := UpdateToken(db, token, refresh_token, user.ID.String())
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create the user. Error while creating the user"},
			)
			return
		}

		// reponse
		c.JSON(http.StatusOK, createUserResponse(newUser))
	}
}
>>>>>>> 75ef7ea2213b8b825f91ce4a51b1a4714f2d0716
