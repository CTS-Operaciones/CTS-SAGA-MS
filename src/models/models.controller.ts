import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { FindOneWhitTermAndRelationDto, PaginationDto } from 'src/common';
import { find } from 'rxjs';

@Controller()
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @MessagePattern('createModel')
  create(@Payload() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  @MessagePattern('findAllModels')
  findAll(@Payload() pagination: PaginationDto) {
    return this.modelsService.findAll(pagination);
  }

  @MessagePattern('findOneModel')
  findOne(
    @Payload()
    { term, relations, allRelations, deletes }: FindOneWhitTermAndRelationDto,
  ) {
    return this.modelsService.findOne({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('updateModel')
  update(@Payload() updateModelDto: UpdateModelDto) {
    return this.modelsService.update(updateModelDto);
  }

  @MessagePattern('removeModel')
  remove(@Payload() { id }: { id: number }) {
    return this.modelsService.remove(id);
  }
}
