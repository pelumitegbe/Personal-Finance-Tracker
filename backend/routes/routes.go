package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/pelumitegbe/Personal-Finance-Tracker/controllers"
	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
)

func UserRoutes(incomingRoutes *gin.Engine, db *database.Queries) {
	incomingRoutes.POST("/users/transactions", controllers.AddTransaction(db))
	incomingRoutes.GET("/users/transactions", controllers.GetTransactions(db))
}
