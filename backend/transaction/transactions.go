package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite" // Use your preferred DB driver
	"gorm.io/gorm"
)

type Transaction struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
}

var db *gorm.DB
var err error

func main() {
	router := gin.Default()

	db, err = gorm.Open(sqlite.Open("transactions.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the database!")
	}

	db.AutoMigrate(&Transaction{})

	router.POST("/add-transaction", addTransaction)

	router.Run(":8080")
}

func addTransaction(c *gin.Context) {
	var newTransaction Transaction

	if err := c.ShouldBindJSON(&newTransaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Create(&newTransaction)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction added successfully!"})
}
