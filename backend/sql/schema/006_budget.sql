-- +goose Up
CREATE TABLE budget (
  id UUID PRIMARY KEY,
  user_id UUID references users(id) NOT NULL,
  amount NUMERIC(12,2) NOT NULL check (amount >= 0),
  spent_amount NUMERIC(12,2) DEFAULT 0 NOT NULL,
  remaining_amount NUMERIC(12,2) GENERATED ALWAYS AS (amount - spent_amount) STORED,
  spent_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
  CASE 
      WHEN amount > 0 THEN (( spent_amount * 100 ) / amount)
      ELSE 0
  END
  ) STORED,
  valid BOOLEAN DEFAULT FALSE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL check (end_date >= start_date),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- +goose Down
DROP TABLE budget;
