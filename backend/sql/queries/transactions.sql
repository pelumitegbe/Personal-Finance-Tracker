-- name: AddTransactions :one
INSERT INTO transactions (
  id,amount,description,transaction_type,categories_id,user_id,transaction_date,created_at, updated_at
) VALUES ( $1,$2,$3,$4, $5,$6,$7,$8,$9)
RETURNING *;

-- name: GetAllTransactions :many
SELECT id, amount,transaction_type,description,categories_id,user_id,transaction_date,created_at, updated_at FROM transactions
WHERE user_id = $1;

-- name: DeleteTransactionById :one
DELETE FROM transactions
WHERE id =$1 and user_id = $2
RETURNING *;

-- name: GetTransactionById :one
SELECT * FROM transactions
WHERE id = $1;

-- name: UpdateTransaction :one
UPDATE transactions
  SET amount = $3, description = $4,transaction_type = $5, categories_id = $6,updated_at = $7
  WHERE id = $1 and user_id=$2
RETURNING *;
