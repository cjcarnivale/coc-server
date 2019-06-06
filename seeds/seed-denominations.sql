-- psql -d coc -U postgres -f ./seeds/seed-denominations.sql

INSERT INTO denominations (name, multiplier)
VALUES
  ('Quarters', 10),
  ('Dimes', 5),
  ('Nickles', 2),
  ('Pennies', 0.5),
  ('Ones', 1),
  ('Fives', 5),
  ('Tens', 10),
  ('Twenties', 20),
  ('Fifties', 50),
  ('Hundreds', 100)