'use strict';

require('dotenv').config();

module.exports = {
  migrationDirectory  : 'migrations',
  driver              : 'pg',
  username            : process.env.DB_MIGRATION_USER,
  password            : process.env.DB_MIGRATION_PASS,
  host                : process.env.DB_MIGRATION_HOST,
  port                : process.env.DB_MIGRATION_PORT,
  database            : process.env.DB_MIGRATION_DATABASE,
  ssl                 : true,
};