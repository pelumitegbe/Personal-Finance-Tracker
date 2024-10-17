-- name: CreateUser :exec
INSERT INTO users (
  id,username,email,password,first_name,last_name,role,created_at,updated_at
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) 
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetUserById :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByUsernameOrEmail :one
SELECT * FROM users WHERE username = $1 OR email = $2;


-- name: CheckUserExists :one
SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE email = $1 OR username = $2
);

-- name: UpdateUserTokens :one
UPDATE users
  SET token = $2, refresh_token= $3, updated_at = $4
  WHERE id = $1
RETURNING *;

-- name: GetRefreshTokenByID :one
SELECT refresh_token FROM users WHERE id = $1;
