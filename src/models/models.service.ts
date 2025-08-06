import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Model } from 'cts-entities';

import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { createResult, deleteResult, ErrorManager, findOneByTerm, FindOneWhitTermAndRelationDto, PaginationRelationsDto, paginationResult, updateResult } from 'src/common';
import { BrandsService } from 'src/brands/brands.service';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model) private modelRepository: Repository<Model>,
    private readonly brandsService: BrandsService,
  ) {}
  async create(createModelDto: CreateModelDto) {
    try {
      const brandExist = await this.brandsService.findOne(
        createModelDto.brandId,
      );

      const result = await createResult(
        this.modelRepository,
        { ...createModelDto, brand: brandExist },
        Model,
      );
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const option: FindManyOptions<Model> = {};
      if (pagination.relations) option.relations = { brand: true };
      const result = await paginationResult(this.modelRepository, {
        ...pagination,
        options: option,
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne({
    term: id,
    relations,
    deletes,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<Model> = {
        where: { id: +id },
        relations: { brand: true },
      };

      if (relations)
        options.relations = {
          ...options.relations,
          brand: true,
        };
      if (allRelations) {
        options.relations = {
          ...options.relations,
          brand: true,
        };
      }
      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(this.modelRepository, {
        all: true,
        options: options,
      });

      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateModelDto: UpdateModelDto) {
    try {
      const { id, ...res } = updateModelDto;
      const model = await findOneByTerm({
        repository: this.modelRepository,
        term: id,
      });
      Object.assign(model, res);
      const result = await updateResult(this.modelRepository, id, model);
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  remove(id: number) {
    try {
      return deleteResult(this.modelRepository, id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
