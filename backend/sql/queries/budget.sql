-- name: CreateBudget :one
INSERT INTO budget (
  id,user_id,amount,start_date,valid,end_date,created_at,updated_at
) VALUES ( $1,$2,$3,$4,$5,$6,$7,$8 )
RETURNING *;

-- name: UpdateBudget :one
UPDATE budget
  SET amount = $3,spent_amount = $4, start_date = $5, end_date=$6,updated_at= $7 
  WHERE id = $1 and user_id = $2
RETURNING *;

-- name: DeleteBudget :one
DELETE FROM budget
  WHERE id = $1 and user_id = $2
RETURNING *;

-- name: MakeBudgetInvalid :one
UPDATE budget
  SET valid = FALSE
  WHERE id = $1 and user_id = $2
RETURNING *;

-- name: CheckBudgetOverlap :one
SELECT COUNT(*) > 0 AS has_overlap
FROM budget
WHERE user_id = $1
  AND (
    ($2 BETWEEN start_date AND end_date)
    OR
    ($3 BETWEEN start_date AND end_date)
    OR
    (start_date BETWEEN $2 AND $3)
    OR
    (end_date BETWEEN $2 AND $3)
  );
