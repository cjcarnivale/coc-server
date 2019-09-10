-- psql -d coc -U postgres -f ./seeds/seed-denominations.sql

INSERT INTO denominations (name, multiplier, type)
VALUES
  ('quarters', 10, 'roll'),
  ('dimes', 5, 'roll'),
  ('nickles', 2, 'roll'),
  ('pennies', 0.5, 'roll'),
  ('ones', 1, 'bill'),
  ('fives', 5, 'bill'),
  ('tens', 10, 'bill'),
  ('twenties', 20, 'bill'),
  ('fifties', 50, 'bill'),
  ('hundreds', 100, 'bill')