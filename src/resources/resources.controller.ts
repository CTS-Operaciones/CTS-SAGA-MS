import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import {
  FindOneWhitTermAndRelationDto,
  PaginationDto,
  PaginationRelationsDto,
} from 'src/common';

@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @MessagePattern('createResource')
  create(@Payload() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @MessagePattern('findAllResources')
  findAll(@Payload() pagination: PaginationRelationsDto) {
    return this.resourcesService.findAll(pagination);
  }
  @MessagePattern('getAllResourcesConcat')
  getAllResourcesConcat() {
    return this.resourcesService.getAllResourcesConcat();
  }

  @MessagePattern('findOneResource')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    console.log({ term, deletes, relations, allRelations });
    return this.resourcesService.findOne({
      term,
      deletes,
      relations,
      allRelations,
    });
  }

  @MessagePattern('updateResource')
  update(@Payload() updateResourceDto: UpdateResourceDto) {
    return this.resourcesService.update(updateResourceDto);
  }

  @MessagePattern('removeResource')
  remove(@Payload() { id }: { id: number }) {
    return this.resourcesService.remove(id);
  }
}
