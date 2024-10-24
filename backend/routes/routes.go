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
	incomingRoutes.POST("/auth/refresh-token", controllers.GenerateAccessTokenFromRefreshToken(db))
	authRoutes := incomingRoutes.Group("/")
	authRoutes.Use(middleware.Authentication())
	{
		// auth route

		// user route
		authRoutes.POST("/users/transactions", controllers.AddTransaction(db))
		authRoutes.GET("/users/transactions", controllers.GetTransactions(db))
		authRoutes.DELETE("/users/transactions/:id", controllers.DeleteTransactions(db))
		authRoutes.PATCH("/users/transactions/:id", controllers.EditTransactions(db))

	}

	adminRoutes := incomingRoutes.Group("/admin")
	adminRoutes.Use(middleware.Authentication())
	adminRoutes.Use(middleware.AdminAuthorizaton())
	{
		adminRoutes.POST("/admin/category", controllers.CreateCategory(db))
	}
}
