-- name: AddTransactions :exec
INSERT INTO transactions (
  id,amount,description,transaction_type,categories_id,user_id,transaction_date,created_at, updated_at
) VALUES ( $1,$2,$3,$4, $5,$6,$7,$8,$9)
RETURNING *;

-- name: GetAllTransactions :many
SELECT amount,transaction_type,description,categories_id,transaction_date,created_at, updated_at FROM transactions
where user_id = $1;
