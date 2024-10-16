package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/routes"
)

type apiConfig struct {
	DB *database.Queries
}

func main() {
	var port string
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// loading the port value from env
	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dbURL := os.Getenv("DB_URL")

	// opening a database connection
	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
		return
	}

	db := database.New(conn)

	// initializing our router
	router := gin.New()
	router.Use(gin.Logger())

	// Custom CORS configuration to allow requests from frontend
	corsConfig := cors.Config{
		AllowAllOrigins:  true,
		// AllowOrigins:     []string{"http://localhost:3000"}, // Allow only frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
		ExposeHeaders:    []string{"Content-Length"}, // Expose specific headers
		AllowCredentials: true, // Allow credentials like cookies
	}
	router.Use(cors.New(corsConfig))

	routes.UserRoutes(router, db)

	// running the server on port 8080
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Error starting the server")
	}
}
