import { Module } from '@nestjs/common';
import { TypeormConnection } from './TypeormConnection';

@Module({
  providers: [TypeormConnection],
  exports: [TypeormConnection],
})
export class DatabaseModule {}
