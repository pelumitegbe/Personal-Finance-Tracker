package controllers

import (
	"bytes"
	"context"
	"image"
	"net/http"
	"time"

	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"

	"github.com/pelumitegbe/Personal-Finance-Tracker/database"
	"github.com/pelumitegbe/Personal-Finance-Tracker/models"
)

func ProcessReceipt(db *database.Queries) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
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
		/* var buf []byte
		buffer := imaging.New(resized.Bounds().Dx(), resized.Bounds().Dy(), imaging.RGBA)
		imaging.Encode(buffer, resized, imaging.JPEG)
		base64Image := base64.StdEncoding.EncodeToString(buf) */
		var buffer bytes.Buffer
		err = imaging.Encode(&buffer, resized, imaging.JPEG)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error encoding image"})
			return
		}

		// Simulate AI processing
		// Replace with actual AI processing logic
		parsedReceipt := models.ReceiptResponse{
			StoreName:   "Example Store",
			TotalAmount: 123.45,
			Category:    "Food",
			ReceiptDate: time.Now().Format("2006-01-02"),
			ReceiptTime: time.Now().Format("03:04 PM"),
		}

		// Convert response to JSON
		c.JSON(http.StatusOK, gin.H{"parsedReceipt": parsedReceipt})
	}
}
