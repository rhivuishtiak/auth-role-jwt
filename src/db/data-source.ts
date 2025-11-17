import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.env' });

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT ?? 5432);

// Support either style of env names:
const DB_USER = process.env.DB_USER ?? process.env.DB_USERNAME;
const DB_PASS = process.env.DB_PASS ?? process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME ?? process.env.DB_DATABASE;

export default new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  // find all entities anywhere under src/**/entities
  entities: [path.join(__dirname, '..', '/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'dev',
});
