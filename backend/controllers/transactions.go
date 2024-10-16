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

// handler for getting all the transactions
func GetTransactions(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		uid, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		transactions, err := db.GetAllTransactions(ctx, uid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve transactions"})
			return
		}

		c.JSON(http.StatusOK, transactions)
	}
}

// function to add a transaction
func AddTransaction(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		// creating a context so that the request will timeout after certain time
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// creating a transaction variable
		var transactions models.Transaction
		if err := c.BindJSON(&transactions); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// getting the user id from the request
		user_id, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// changing string to  null string
		description := ToNullString(transactions.Description)

		// getting our category id
		category, err := db.GetCategory(ctx, transactions.Category)
		// fmt.Print(category)
		if err != nil {
			c.JSON(
				http.StatusBadRequest,
				gin.H{"error": "Provide valid category type"},
			)
			return
		}

		// setting up our struct for pushing it into the database  with proper values
		transactionData := database.AddTransactionsParams{
			ID:              uuid.New(),
			Amount:          transactions.Amount,
			TransactionType: transactions.TransactionType,
			Description:     description,
			CategoriesID:    category.ID,
			UserID:          user_id,
			TransactionDate: time.Now().Truncate(24 * time.Hour),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}

		// adding the transaction to the database
		err = db.AddTransactions(ctx, transactionData)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create and store the transaction data"},
			)

			// c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		// succesfully returning once the transaction is added to the database
		c.JSON(http.StatusCreated, gin.H{"Success": "Transaction created successfully"})
	}
}
