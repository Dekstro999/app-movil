import { Module } from '@nestjs/common';
import { ToDosResolver } from './to-dos.resolver';
import { ToDosService } from './to-dos.service';

@Module({
  providers: [ToDosResolver, ToDosService]
})
export class ToDosModule {}
