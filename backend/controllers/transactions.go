package controllers

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

func GetTransactions(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		transactions, err := db.GetAllTransactions(ctx)
		if err != nil {
			c.JSON(http.StatusBadRequest, "couldn't get all the transactions")
			return
		}

		c.JSON(http.StatusOK, transactions)
	}
}

// convert string to NullString
func ToNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{
			String: s,
			Valid:  false,
		}
	}
	return sql.NullString{
		String: s,
		Valid:  true,
	}
}

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

		category := ToNullString(transactions.Category)
		description := ToNullString(transactions.Description)
		transactionData := database.AddTransactionsParams{
			ID:              uuid.New(),
			Amount:          transactions.Amount,
			TransactionType: transactions.Transaction_type,
			Description:     description,
			Category:        category,
			TransactionDate: time.Now().Truncate(24 * time.Hour),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}
		err := db.AddTransactions(ctx, transactionData)
		if err != nil {
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Not Created"})

			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, "Successfully added the transaction to the database")
	}
}
