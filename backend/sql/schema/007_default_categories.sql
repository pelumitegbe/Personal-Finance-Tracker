-- +goose Up
INSERT INTO category (id, name, created_at)
VALUES 
    (gen_random_uuid(), 'Food', NOW()),
    (gen_random_uuid(), 'Transportation', NOW()),
    (gen_random_uuid(), 'Housing', NOW()),
    (gen_random_uuid(), 'Utilities', NOW()),
    (gen_random_uuid(), 'Entertainment', NOW()),
    (gen_random_uuid(), 'Healthcare', NOW()),
    (gen_random_uuid(), 'Education', NOW()),
    (gen_random_uuid(), 'Other', NOW());

-- +goose Down
DELETE FROM category 
WHERE name IN ('Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Other');
