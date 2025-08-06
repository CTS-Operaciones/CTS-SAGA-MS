import { Injectable } from '@nestjs/common';
import { CreateAddRemoveDto } from './dto/create-add-remove.dto';
import { UpdateAddRemoveDto } from './dto/update-add-remove.dto';
import {
  createResult,
  deleteResult,
  ErrorManager,
  findOneByTerm,
  FindOneWhitTermAndRelationDto,
  PaginationRelationsDto,
  paginationResult,
  runInTransaction,
  updateResult,
} from 'src/common';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { addRemoval } from 'cts-entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddRemoveService {
  constructor(
    @InjectRepository(addRemoval)
    private readonly addRemovalRepository: Repository<addRemoval>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createAddRemoveDto: CreateAddRemoveDto) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const { type, ...rest } = createAddRemoveDto;

        const addRemove = await createResult(
          this.addRemovalRepository,
          {
            ...createAddRemoveDto,
            type: createAddRemoveDto.type,
          },
          addRemoval,
          queryRunner,
        );
        return addRemove;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const options: FindManyOptions<addRemoval> = {};
      const { relations } = pagination;
      if (pagination.relations) {
        options.relations = {};
      }

      if (relations) {
        options.relations = {
          ...options.relations,
          inventoryHasAddRemoval: {
            inventory: {
              ubications: true,
              resource: {
                clasification: true,
                model: {
                  brand: true,
                },
              },
            },
          },
        };
      }
      const result = await paginationResult(this.addRemovalRepository, {
        ...pagination,
        options,
      });
      return result;
    } catch (error) {}
  }

  async findOne({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<addRemoval> = {};

      if (relations)
        options.relations = {
          ...options.relations,
          inventoryHasAddRemoval: {
            inventory: {
              ubications: true,
            },
          },
        };
      if (allRelations) {
        options.relations = {
          inventoryHasAddRemoval: {
            inventory: {
              state: true,
              resource: {
                clasification: true,
                model: true,
              },
            },
          },
        };
      }
      if (deletes) {
        options.withDeleted = true;
      }

      const result = await findOneByTerm({
        repository: this.addRemovalRepository,
        term,
        options,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateAddRemoveDto: UpdateAddRemoveDto) {
    try {
      const { id, ...rest } = updateAddRemoveDto;
      return await runInTransaction(this.dataSource, async (queryRunner) => {
        const addRemoval = await this.findOne({
          term: id,
          relations: true,
        });

        if (
          rest.ubicationId &&
          rest.ubicationId !==
            addRemoval.inventoryHasAddRemoval[0].inventory.ubications.id
        ) {
          const ubicationExist = await this.findOne({
            term: rest.ubicationId,
          });
          addRemoval.inventoryHasAddRemoval[0].inventory[0].ubications =
            ubicationExist;
        }
        Object.assign(addRemoval, rest);
        const result = await updateResult(
          this.addRemovalRepository,
          id,
          addRemoval,
          queryRunner,
        );
        return result;
      });
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: number) {
    try {
      return deleteResult(this.addRemovalRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
