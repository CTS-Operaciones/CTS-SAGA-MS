import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import {
  createResult,
  deleteResult,
  ErrorManager,
  findOneByTerm,
  FindOneWhitTermAndRelationDto,
  PaginationDto,
  PaginationRelationsDto,
  paginationResult,
  updateResult,
} from 'src/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ClasificationsService } from 'src/clasifications/clasifications.service';
import { ModelsService } from 'src/models/models.service';
import { Resource } from 'cts-entities';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private readonly clasificationsService: ClasificationsService,
    private readonly modelsService: ModelsService,
  ) {}
  async create(createResourceDto: CreateResourceDto) {
    try {
      const { clasificationId, modelId } = createResourceDto;
      if (clasificationId && modelId) {
        const claExist = await this.clasificationsService.findOne(
          createResourceDto.clasificationId,
        );

        const modelExist = await this.modelsService.findOne({
          term: createResourceDto.modelId,
        });

        Object.assign(createResourceDto, {
          clasification: claExist,
          model: modelExist,
        });
      }

      const result = await createResult(
        this.resourceRepository,
        { ...createResourceDto },
        Resource,
      );

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const { relations } = pagination;
      const options: FindManyOptions<Resource> = {};

      if (relations) {
        if (pagination.relations) {
          options.relations = {};
        }

        options.relations = {
          inventory: true,
          clasification: true,
          model: {
            brand: true,
          },
        };
      }

      const resource = await paginationResult(this.resourceRepository, {
        ...pagination,
        options,
      });

      return resource;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async findOneByName({
    name,
    clasificationId,
    modelId,
    ...rest
  }: CreateResourceDto) {
    try {
      const result = await this.resourceRepository.findOne({
        where: {
          name,
          clasification: { id: clasificationId },
          model: { id: modelId },
        },
        relations: { clasification: true, model: true },
      });

      if (!result) {
        if (clasificationId) {
          const clasification =
            await this.clasificationsService.findOne(clasificationId);
        }
        if (modelId) {
          const model = await this.modelsService.findOne({
            term: modelId,
            relations: true,
          });
        }
        return await this.create({
          name,
          clasificationId,
          modelId,
          ...rest,
        });
      }

      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async getAllResourcesConcat() {
    const resources = await this.resourceRepository
      .createQueryBuilder('r')
      .select(
        `r.id , concat(r."name",' - ', c."name", ' - ', m."name", ' - ', b."name") AS name `,
      )
      .leftJoin('r.clasification', 'c')
      .leftJoin('r.model', 'm')
      .leftJoin('m.brand', 'b')
      .getRawMany();
    return resources;
  }

  async findOne({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<Resource> = {
        where: { id: +term },
        relations: { clasification: true, model: true },
      };

      if (relations)
        options.relations = {
          ...options.relations,
          model: {
            resource: {
              clasification: true,
              model: true,
            },
          },
        };
      if (allRelations) {
        options.relations = {
          clasification: true,
          model: {
            resource: {
              clasification: true,
              model: {
                brand: true,
              },
            },
          },
        };
      }

      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(this.resourceRepository, {
        all: true,
        options,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async update(updateResourceDto: UpdateResourceDto) {
    try {
      const { id, ...res } = updateResourceDto;
      const resource = await this.findOne({ term: id, relations: true });

      if (res.modelId && res.modelId !== resource.data[0].model.id) {
        const modelExist = await this.modelsService.findOne({
          term: res.modelId,
        });
        resource.data[0].model[0] = modelExist;
      }
      if (
        res.clasificationId &&
        res.clasificationId !== resource.data[0].clasification.id
      ) {
        const claExist = await this.clasificationsService.findOne(
          res.clasificationId,
        );
        resource.data[0].clasification = claExist;
      }
      Object.assign(resource, res);
      const result = await updateResult(
        this.resourceRepository,
        id,
        resource.data[0],
      );
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  remove(id: number) {
    try {
      return deleteResult(this.resourceRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async getInventoriesByResource(idResource: number) {
    try {
      const result = await this.resourceRepository.findOne({
        where: { id: idResource },
        relations: ['inventory'],
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
