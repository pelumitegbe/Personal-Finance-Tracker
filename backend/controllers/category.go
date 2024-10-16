package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

func CreateCategory(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*100)
		defer cancel()

		var category models.Category
		if err := c.BindJSON(&category); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Request body not valid",
			})
			return
		}

		categoryData := database.CreateCategoryParams{
			ID:        uuid.New(),
			Name:      category.Name,
			CreatedAt: time.Now(),
		}

		err := db.CreateCategory(ctx, categoryData)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create two category of same name"},
			)
			return
		}

		c.JSON(http.StatusCreated, gin.H{"Success": "Category created successfully"})
	}
}

func GetAllCategory(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		categories, err := db.GetAllCategory(ctx)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't get the categories"})
			return
		}

		c.JSON(http.StatusOK, categories)
	}
}
