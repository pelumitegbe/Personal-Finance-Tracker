package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID     `json:"id"`
	Username     string        `json:"username"`
	FirstName    string        `json:"first_name"`
	LastName     string        `json:"last_name"`
	Password     string        `json:"password"`
	Email        string        `json:"email"`
	Phone        int64         `json:"phone"`
	Token        string        `json:"token"`
	RefreshToken string        `json:"refresh_token"`
	Transactions []Transaction `json:"transactions"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
}

type UserResponse struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	Token        string    `json:"token"`
	RefreshToken string    `json:"refresh_token"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Transaction struct {
	ID              uuid.UUID `json:"id"               bson:"id"`
	Amount          string    `json:"amount"                     validate:"required"`
	Currency        string    `json:"currency"                   validate:"required"`
	TransactionType string    `json:"transaction_type"           validate:"required"`
	Description     string    `json:"description"`
	Category        string    `json:"category"                   validate:"required"`
	TransactionDate time.Time `json:"transaction_date"`
	Created_At      time.Time `json:"created_at"`
	Updated_At      time.Time `json:"updtaed_at"`
}

type Category struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Created_At time.Time `json:"created_at"`
}
