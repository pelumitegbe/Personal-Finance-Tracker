package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/pelumitegbe/Personal-Finance-Tracker/controllers"
	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/middleware"
)

func UserRoutes(incomingRoutes *gin.Engine, db *database.Queries) {
	incomingRoutes.GET("/category", controllers.GetAllCategory(db))
	incomingRoutes.POST("/users/signup", controllers.Signup(db))
	incomingRoutes.POST("/users/login", controllers.Login(db))
	authRoutes := incomingRoutes.Group("/")
	authRoutes.Use(middleware.Authentication())
	{
		authRoutes.POST("/users/transactions", controllers.AddTransaction(db))
		authRoutes.GET("/users/transactions", controllers.GetTransactions(db))
	}

	adminRoutes := incomingRoutes.Group("/admin")
	adminRoutes.Use(middleware.Authentication())
	adminRoutes.Use(middleware.AdminAuthorizaton())
	{
		adminRoutes.POST("/admin/category", controllers.CreateCategory(db))
	}
}

// balance

func getBalance(c *gin.Context) {
	var transactions []Transaction

	// Fetch all transactions from the database
	result := db.Find(&transactions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transactions"})
		return
	}

	// Initialize balance
	var balance float64

	// Calculate balance based on categories (assuming "Income" and "Expense" categories)
	for _, transaction := range transactions {
		if isIncomeCategory(transaction.Category) {
			balance += transaction.Amount
		} else {
			balance -= transaction.Amount
		}
	}

	// Respond with the balance
	c.JSON(http.StatusOK, gin.H{"balance": balance})
}

// Helper function to determine if a category represents income
func isIncomeCategory(category string) bool {
	// Modify this logic based on your specific categories for income
	incomeCategories := map[string]bool{
		"Salary":     true,
		"Investment": true,
		"Bonus":      true,
	}

	return incomeCategories[category]
}
