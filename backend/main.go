package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	var port string
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := gin.New()

	// running the server on port 8080
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Error starting the server")
	}
}
