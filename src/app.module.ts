import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PublishersModule } from './publishers/publishers.module';
import { PassportModule } from '@nestjs/passport';
import { SponsorshipsModule } from './sponsorships/sponsorships.module';
import { DonatesModule } from './donates/donates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // use first loaded file
      envFilePath: [
        `./env/.env.stage.${process.env.STAGE}`,
        `.env.stage.${process.env.STAGE}`,
        `.env.stage.${process.env.STAGE}.local`,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, PassportModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        const isLocalMode = !process.env.NODE_ENV;

        console.log('PROD_ENV', configService.get('PROD_ENV'));

        return {
          type: 'postgres',
          host: isLocalMode ? 'localhost' : configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: ['dist/**/*.entity{ .ts,.js}'],
          autoLoadEntities: isLocalMode,
          synchronize: !isProduction,
          migrationsTableName: 'migrations_typeorm',
          migrations: isProduction
            ? ['dist/migrations/**/*{.ts,.js}']
            : ['dist/migrations/data/*{.ts,.js}'],
          migrationsRun: !isLocalMode,
          migrationsTransactionMode: 'each',
          logging: ['schema', 'migration', 'error'],
          logger: 'simple-console',
        };
      },
    }),
    AuthModule,
    PostsModule,
    PublishersModule,
    SponsorshipsModule,
    DonatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
