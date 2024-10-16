-- name: CreateCategory :exec
INSERT INTO category (
  id,name,created_at
) VALUES ($1,$2,$3)
RETURNING *;

-- name: GetCategory :one
SELECT * FROM category 
WHERE name = $1;

-- name: GetAllCategory :many
SELECT * FROM category;

