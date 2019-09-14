-- psql -d coc -U postgres -f ./seeds/seed-denominations.sql
INSERT INTO
  denominations (name, multiplier, type, change_order)
VALUES
  ('quarters', 10, 'roll', true),
  ('dimes', 5, 'roll', true),
  ('nickles', 2, 'roll', true),
  ('pennies', 0.5, 'roll', true),
  ('ones', 1, 'bill', true),
  ('fives', 5, 'bill', true),
  ('tens', 10, 'bill', false),
  ('twenties', 20, 'bill', false),
  ('fifties', 50, 'bill', false),
  ('hundreds', 100, 'bill', false)