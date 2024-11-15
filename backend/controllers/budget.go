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

func CreateBudget(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// create a budget variabe
		var budget models.Budget
		if err := c.BindJSON(&budget); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// check if the budget start date is in the past
		if budget.StartDate.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Budget date cannot be in the past "})
			return
		}

		// get the user id from the request
		user_id, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// create budgetdata params
		budgetData := database.CreateBudgetParams{
			ID:        uuid.New(),
			UserID:    user_id,
			Amount:    budget.Amount,
			StartDate: budget.StartDate,
			EndDate:   budget.EndDate,
			Valid:     true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		finalBudget, err := db.CreateBudget(ctx, budgetData)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "couldn't create and store the budget data"},
			)
			return
		}

		c.JSON(http.StatusCreated, finalBudget)
	}
}

// make budget invalid so that we can delete it later
func MakeBudgetInvalid(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		bud_id := c.Param("id")
		if bud_id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide valid transaction id in the url"})
			return
		}

		budget_id, err := uuid.Parse(bud_id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide valid transaction id in the url"})
			return
		}

		user_id, msg := getUserIdFromRequest(c)
		if msg == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
			return
		}

		_, err = db.MakeBudgetInvalid(ctx, database.MakeBudgetInvalidParams{
			ID:     budget_id,
			UserID: user_id,
		})
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "couldn't make the budget invalid"},
			)
			return
		}

		c.JSON(http.StatusNoContent, map[string]interface{}{
			"status":  "success",
			"message": "budget successfully invalidated",
		})
	}
}
