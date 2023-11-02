import { Module } from '@nestjs/common';
import { Hasher, UTILS_HASHER } from './utils/hasher/hasher';

@Module({
  providers: [
    {
      provide: UTILS_HASHER,
      useClass: Hasher,
    },
  ],
  exports: [
    {
      provide: UTILS_HASHER,
      useClass: Hasher,
    },
  ],
})
export class SharedModule {}
