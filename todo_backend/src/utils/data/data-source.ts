import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function initializeDatabase() {
  try {
    await createDatabase({ options: composeDataSourceParams(), ifNotExist: true });

    const dataSource = new DataSource(composeDataSourceParams());
    await dataSource.initialize();

    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations executed.');

    console.log('Database has been initialized!');
  } catch (error) {
    console.error('Error during Database initialization', error);
  }
}

export function composeDataSourceParams(): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [`${__dirname}/../../domain/**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/migrations/*.{js,ts}`],
    migrationsRun: process.env.NODE_ENV === 'development',
  };
}

export default new DataSource(composeDataSourceParams());
