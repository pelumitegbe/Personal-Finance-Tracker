package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/tokens"
)

func GenerateAccessTokenFromRefreshToken(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
		defer cancel()

		refresh_token := c.Request.Header.Get("token")

		// validate refresh token
		claims, msg := tokens.ValidateToken(refresh_token)
		if msg != "" {
			c.JSON(
				http.StatusUnauthorized,
				gin.H{"error": msg},
			)
			return
		}

		// parse user id into uuid
		user_id, err := uuid.Parse(claims.Uid)
		if err != nil {
			msg = "Internal server error"
			return
		}

		// get users refresh token stored in the database
		user_refresh_token, err := db.GetRefreshTokenByID(ctx, user_id)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Error while getting the users refresh token"},
			)
			return
		}

		// check if the refresh token provided and the one in the database is the same
		if refresh_token != user_refresh_token.String {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
			return
		}

		// generate new token for token rotation
		tokens, new_refresh_token, err := tokens.TokenGenerator(
			claims.Email,
			claims.First_Name,
			claims.Last_Name,
			claims.Username,
			claims.Uid,
			claims.Role,
		)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Error while generating new tokens"},
			)
			return
		}

		// store the new token in the database
		user, err := UpdateToken(db, tokens, new_refresh_token, claims.Uid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error while updating the token"})
			return
		}

		// return the response
		c.JSON(http.StatusCreated, createUserResponse(user))
	}
}
