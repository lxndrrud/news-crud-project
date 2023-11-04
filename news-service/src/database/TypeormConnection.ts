import { DataSource } from 'typeorm';

export const TYPEORM_CONNECTION = 'TYPEORM_CONNECTION';

export const TypeormConnection = {
  provide: TYPEORM_CONNECTION,
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
    });

    return dataSource.initialize();
  },
};
