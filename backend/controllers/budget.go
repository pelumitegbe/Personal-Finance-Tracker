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

// CreateBudget handles creating a new budget
func CreateBudget(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var budget models.Budget
		if err := c.BindJSON(&budget); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// Validate budget dates
		if budget.StartDate.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be in the past"})
			return
		}

		userID, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		budgetData := database.CreateBudgetParams{
			ID:        uuid.New(),
			UserID:    userID,
			Amount:    budget.Amount,
			StartDate: budget.StartDate,
			EndDate:   budget.EndDate,
			Valid:     true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		// check if another budget is on the same date
		hasBudget, err := db.CheckBudgetOverlap(ctx, database.CheckBudgetOverlapParams{
			UserID:      userID,
			StartDate:   budget.StartDate,
			StartDate_2: budget.EndDate,
		})
		if hasBudget {
			c.JSON(
				http.StatusConflict,
				gin.H{"Error": "there is already budget on the same date"},
			)
			return
		}

		// create if not conflict
		finalBudget, err := db.CreateBudget(ctx, budgetData)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create and store the budget data"},
			)
			return
		}

		// Use createBudgetResponse for consistent response format
		c.JSON(http.StatusCreated, createBudgetResponse(finalBudget))
	}
}

// MakeBudgetInvalid marks a budget as invalid
func MakeBudgetInvalid(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		budID := c.Param("id")
		if budID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide a valid budget ID in the URL"})
			return
		}

		budgetID, err := uuid.Parse(budID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide a valid budget ID"})
			return
		}

		userID, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
			return
		}

		_, err = db.MakeBudgetInvalid(ctx, database.MakeBudgetInvalidParams{
			ID:     budgetID,
			UserID: userID,
		})
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't make the budget invalid"},
			)
			return
		}

		c.JSON(http.StatusNoContent, gin.H{
			"status":  "success",
			"message": "Budget successfully invalidated",
		})
	}
}

// UpdateBudget handles updating an existing budget
func UpdateBudget(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		budID := c.Param("id")
		if budID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide a valid budget ID in the URL"})
			return
		}

		budgetID, err := uuid.Parse(budID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide a valid budget ID"})
			return
		}

		var updatedBudget models.Budget
		if err = c.BindJSON(&updatedBudget); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		userID, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// Validate budget dates
		if updatedBudget.StartDate.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be in the past"})
			return
		}

		params := database.UpdateBudgetParams{
			ID:        budgetID,
			UserID:    userID,
			Amount:    updatedBudget.Amount,
			StartDate: updatedBudget.StartDate,
			EndDate:   updatedBudget.EndDate,
			UpdatedAt: time.Now(),
		}

		updatedBudgetData, err := db.UpdateBudget(ctx, params)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't update the budget"})
			return
		}

		// Use createBudgetResponse for consistent response format
		c.JSON(http.StatusOK, createBudgetResponse(updatedBudgetData))
	}
}
