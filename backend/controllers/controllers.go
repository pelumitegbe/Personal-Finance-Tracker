package controllers

// not tested
// import (
// 	"net/http"
// 	"github.com/gin-gonic/gin"
// 	"project/models"  
// )

func GetUser(c *gin.Context) {
	id := c.Param("id")  // Get the user ID from the URL
	user, found := models.GetUserByID(id)

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	
	c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.CreateUser(newUser)

	c.JSON(http.StatusCreated, newUser)
}
