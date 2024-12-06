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

-- name: UpdateCategory :exec
UPDATE category
SET name = $2
WHERE id = $1
RETURNING id, name, created_at;

-- name: DeleteCategory :exec
DELETE FROM category
WHERE id = $1;
