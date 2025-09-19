import { Module } from '@nestjs/common';
import { HabilitationService } from './habilitation.service';
import { HabilitationController } from './habilitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilitations } from 'cts-entities';

@Module({
  imports: [TypeOrmModule.forFeature([Habilitations])],
  controllers: [HabilitationController],
  providers: [HabilitationService],
  exports: [HabilitationService],
})
export class HabilitationModule {}
