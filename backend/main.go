package main

import (
	"database/sql"
	"image"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"github.com/disintegration/imaging"
	"github.com/nfnt/resize"
	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/routes"

	// added for receipt
	"encoding/base64"
	"net/http"
	"time"

	_ "github.com/lib/pq"
)

type apiConfig struct {
	DB *database.Queries
}

// added for receipt scanner
type ReceiptResponse struct {
	StoreName   string  `json:"store_name"`
	TotalAmount float64 `json:"total_amount"`
	Category    string  `json:"category"`
	ReceiptDate string  `json:"receipt_date"`
	ReceiptTime string  `json:"receipt_time"`
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
		AllowAllOrigins: true,
		// AllowOrigins:     []string{"http://localhost:3000"}, // Allow only frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},          // Allowed methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "token"}, // Allowed headers
		ExposeHeaders:    []string{"Content-Length"},                                   // Expose specific headers
		AllowCredentials: true,                                                         // Allow credentials like cookies
	}
	router.Use(cors.New(corsConfig))

	routes.UserRoutes(router, db)

	// Route for processing receipts
	router.POST("/process_receipt", func(c *gin.Context) {
		// Parse multipart form data
		form, _ := c.MultipartForm()
		files := form.File["receipt"]

		if len(files) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No receipt image provided"})
			return
		}

		file := files[0]
		f, _ := file.Open()

		// Read image into memory
		img, _, err := image.Decode(f)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding image"})
			return
		}

		// Resize image
		resized := resize.Resize(400, 0, img, resize.Lanczos3)

		// Convert resized image to base64
		var buf []byte
		buffer := imaging.New(resized.Bounds().Dx(), resized.Bounds().Dy(), imaging.RGBA)
		imaging.Encode(buffer, resized, imaging.JPEG)
		base64Image := base64.StdEncoding.EncodeToString(buf)

		// Simulate AI processing
		// Replace with actual AI processing logic
		parsedReceipt := ReceiptResponse{
			StoreName:   "Example Store",
			TotalAmount: 123.45,
			Category:    "Food",
			ReceiptDate: time.Now().Format("2006-01-02"),
			ReceiptTime: time.Now().Format("03:04 PM"),
		}

		// Convert response to JSON
		c.JSON(http.StatusOK, gin.H{"parsedReceipt": parsedReceipt})
	})

	// running the server on port 8080
	err = router.Run(":" + port)
	if err != nil {
		log.Fatal("Error starting the server")
	}
}
