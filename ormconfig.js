// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

const stage = process.env.STAGE || 'dev';
const isLocalMode = !process.env.NODE_ENV;

// use first loaded file
dotenv.config({ path: `./env/.env.stage.${stage}` });
dotenv.config({ path: `.env.stage.${stage}` });
dotenv.config({ path: `.env.stage.${stage}.local` });

module.exports = {
  type: 'postgres',
  host: isLocalMode ? 'localhost' : process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: isLocalMode ? 'dzen_prod' : process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations_typeorm',
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  cli: {
    migrationsDir: 'src/migrations',
  },
};
