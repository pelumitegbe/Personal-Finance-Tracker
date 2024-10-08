package models

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID               uuid.UUID `json:"_id"              bson:"_id"`
	Amount           string    `json:"amount"                      validate:"required"`
	Currency         string    `json:"last_name"                   validate:"required"`
	Transaction_type string    `json:"transaction_type"            validate:"required"`
	Description      string    `json:"description"`
	Category         string    `json:"category"                    validate:"required"`
	Transaction_date time.Time `json:"transaction_date"`
	Created_At       time.Time `json:"created_at"`
	Updated_At       time.Time `json:"updtaed_at"`
}
