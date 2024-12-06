package models

import (
	"time"

	"github.com/google/uuid"
)

type ReceiptImage struct {
	ID        uuid.UUID `json:"id"`
	Image     []byte    `json:"image"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AIResponse struct {
	StoreName   string  `json:"store_name"`
	TotalAmount float64 `json:"total_amount"`
	Category    string  `json:"category"`
	ReceiptDate string  `json:"receipt_date"`
	ReceiptTime string  `json:"receipt_time"`
}
