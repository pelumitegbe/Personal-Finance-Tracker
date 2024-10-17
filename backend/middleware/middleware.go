package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/pelumitegbe/Personal-Finance-Tracker/tokens"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		// getting the token from request header
		clientToken := c.Request.Header.Get("token")
		if clientToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No authorization header provided"})
			c.Abort()
			return
		}

		// validating our token and retrieving its claims
		claims, msg := tokens.ValidateToken(clientToken)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			c.Abort()
			return
		}

		// check if it is access token or not
		if claims.Token_Type != "access" {
			c.JSON(
				http.StatusUnauthorized,
				gin.H{"error": "Invalid token type! Token must be access"},
			)
			c.Abort()
			return
		}

		// setting different variables for further operations
		c.Set("username", claims.Username)
		c.Set("email", claims.Email)
		c.Set("uid", claims.Uid)
		c.Next()
	}
}

func AdminAuthorizaton() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists || userRole != "admin" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized"})
			c.Abort()
			return
		}

		c.Next()
	}
}
