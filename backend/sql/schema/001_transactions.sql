-- +goose Up
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    amount BIGINT NOT NULL,
    description TEXT,
    category VARCHAR(50),
    transaction_type VARCHAR(50) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL 
);
-- +goose Down
DROP TABLE transactions;

-- CREATE TABLE transactions (
--   id  UUID PRIMARY KEY,
--   amount DECIMAL NOT NULL,
--   currency VARCHAR(255) NOT NULL,
--   transaction_type VARCHAR(255) NOT NULL,
--   description TEXT,
--   category VARCHAR(255) NOT NULL,
--   transaction_date TIMESTAMP NOT NULL,
--   created_at TIMESTAMP NOT NULL,
--   updated_at TIMESTAMP NOT NULL
-- );
