package controllers

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
