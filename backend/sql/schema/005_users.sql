-- +goose Up
ALTER TABLE users 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Update existing records to set the role to 'user'
UPDATE users SET role = 'user' WHERE role IS NULL;

-- +goose Down
ALTER TABLE users 
DROP COLUMN role;
