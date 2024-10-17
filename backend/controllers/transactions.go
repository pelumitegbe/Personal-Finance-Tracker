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

		c.JSON(http.StatusOK, createTransactionsResponse(transactions))
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
		transaction, err := db.AddTransactions(ctx, transactionData)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't create and store the transaction data"},
			)

			// c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		// succesfully returning once the transaction is added to the database
		c.JSON(http.StatusCreated, createTransactionsResponse(transaction))
	}
}

func fillUpdateTransactionParams(
	transactionParams *database.UpdateTransactionParams,
	transaction *models.Transaction,
	user_transaction *database.Transaction,
	user_id uuid.UUID,
	category *database.Category,
) *database.UpdateTransactionParams {
	transactionParams.ID = user_transaction.ID
	transactionParams.UserID = user_id
	transactionParams.CategoriesID = category.ID
	if transaction.Amount != "" {
		transactionParams.Amount = transaction.Amount
	} else {
		transactionParams.Amount = user_transaction.Amount
	}
	if transaction.Description != "" {
		transactionParams.Description = ToNullString(transaction.Description)
	} else {
		transactionParams.Description = user_transaction.Description
	}
	if transaction.TransactionType != "" {
		transactionParams.TransactionType = transaction.TransactionType
	} else {
		transactionParams.TransactionType = user_transaction.TransactionType
	}
	transactionParams.UpdatedAt = time.Now().Local()
	return transactionParams
}

// route for updating the transactions
func EditTransactions(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// getting the transaction id
		trans_id := c.Param("id")
		if trans_id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide valid transaction id in the url"})
			return
		}
		transaction_id, err := uuid.Parse(trans_id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Provide valid transaction id in the url"})
			return
		}

		// marshalling the json into our struct
		var transaction models.Transaction
		if err = c.BindJSON(&transaction); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request body not valid"})
			return
		}

		// getting the user id from the request
		user_id, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// get the user info from the database
		_, err = db.GetUserById(c, user_id)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Couldn't get the user"})
			return
		}

		// get the transaction to update from the database
		user_transaction, err := db.GetTransactionById(ctx, transaction_id)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Error while getting the transaction"},
			)
			return
		}

		// get the category by the category name provided
		var category database.Category
		if transaction.Category != "" {

			category, err = db.GetCategory(ctx, transaction.Category)
			if err != nil {
				c.JSON(
					http.StatusBadRequest,
					gin.H{"error": "Invaid body request! category is invalid"},
				)
				return
			}
		} else {
			category.ID = user_transaction.CategoriesID
		}

		var transactionsParams database.UpdateTransactionParams
		transactionsParams = *fillUpdateTransactionParams(&transactionsParams, &transaction, &user_transaction, user_id, &category)

		new_transaction, err := db.UpdateTransaction(c, transactionsParams)
		if err != nil {
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't update the transaction"},
			)
			return
		}

		c.JSON(http.StatusCreated, createTransactionsResponse(new_transaction))
		// db.UpdateTransaction(c, database.UpdateTransactionParams{})
	}
}

// function to delete transaction of a user
func DeleteTransactions(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
		defer cancel()

		// getting transasctions id from the url
		id := c.Param("id")
		transaction_id, err := uuid.Parse(id)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id "})
			return
		}
		// getting the user id from the request
		user_id, msg := getUserIdFromRequest(c)
		if msg != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// deleting transaction from the database
		_, err = db.DeleteTransactionById(
			ctx,
			database.DeleteTransactionByIdParams{
				ID:     transaction_id,
				UserID: user_id,
			},
		)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(
					http.StatusNotFound,
					gin.H{
						"error": "Couldn't find any transactions of the user with provided transactions id",
					},
				)
				return
			}
			c.JSON(
				http.StatusInternalServerError,
				gin.H{"error": "Couldn't delete the transaction please try again"},
			)
			return
		}

		c.JSON(http.StatusNoContent, nil)
	}
}
