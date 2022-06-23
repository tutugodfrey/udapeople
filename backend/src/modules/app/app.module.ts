import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { StatusModule } from '../status/status.module';
import { StatusController } from '../status/status.controller';
import { MetricsModule } from 'modules/metrics/metrics.module';
import { MetricsController } from 'modules/metrics/metrics.controller';
import { AppLogger } from './app.logger';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { OrdersModule } from '../domain/orders/orders.module';
import { EmployeeModule } from '../domain/employees/employee.module';

@Module({
  imports: [
    StatusModule,
    MetricsModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.TypeOrmDatabase,
    }),
    OrdersModule,
    EmployeeModule,
  ],
  controllers: [StatusController, MetricsController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
