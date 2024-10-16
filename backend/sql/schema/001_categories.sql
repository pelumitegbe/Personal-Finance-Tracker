-- +goose Up
CREATE TABLE category (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE category;
