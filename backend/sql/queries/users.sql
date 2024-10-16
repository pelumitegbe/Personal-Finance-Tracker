-- name: CreateUser :exec
INSERT INTO users (
  id,username,email,password,first_name,last_name,created_at,updated_at
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetUserByUsernameOrEmail :one
SELECT * FROM users WHERE username = $1 OR email = $2;


-- name: CheckUserExists :one
SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE email = $1 OR username = $2
);

