import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ClasificationsModule } from '../clasifications/clasifications.module';
import { ModelsModule } from '../models/models.module';
import { Resource } from 'cts-entities';

@Module({
  imports: [
    ClasificationsModule,
    ModelsModule,
    TypeOrmModule.forFeature([Resource]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService, ClasificationsModule, ModelsModule],
})
export class ResourcesModule {}
