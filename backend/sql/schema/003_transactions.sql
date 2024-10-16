-- +goose Up
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    -- user id is added
    userid  INTEGER,
    amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    categories_id UUID REFERENCES category(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL 
);
-- +goose Down
DROP TABLE transactions;
