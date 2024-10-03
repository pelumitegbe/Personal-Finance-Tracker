package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

// function to add a transaction
func AddTransaction(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		var transactions models.Transaction
		defer cancel()

		if err := c.BindJSON(&transactions); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		transactionData := database.AddTransactionsParams{
			ID:              uuid.New(),
			TransactionDate: time.Now(),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}
		fmt.Print(transactionData)
		_, err := db.AddTransactions(ctx, transactionData)
		if err != nil {
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Not Created"})

			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, "Successfully added the transaction to the database")
	}
}
