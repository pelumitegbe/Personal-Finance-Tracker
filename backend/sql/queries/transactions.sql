-- name: AddTransactions :one
INSERT INTO transactions (
  id,amount,transaction_type,description,category,transaction_date,created_at, updated_at
) VALUES ( $1,$2,$3,$4, $5,$6,$7,$8)
RETURNING *;
