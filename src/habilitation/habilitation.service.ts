import { Injectable } from '@nestjs/common';
import { CreateHabilitationDto } from './dto/create-habilitation.dto';
import { UpdateHabilitationDto } from './dto/update-habilitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { admissionsDischarges, Habilitations } from 'cts-entities';
import { DataSource, FindManyOptions, QueryRunner, Repository } from 'typeorm';

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

@Injectable()
export class HabilitationService {
  constructor(
    @InjectRepository(Habilitations)
    private readonly habilitationRepository: Repository<Habilitations>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createHabilitationDto: CreateHabilitationDto) {
    try {
      return runInTransaction(this.dataSource, async (manager) => {
        const { ...rest } = createHabilitationDto;
        const result = await createResult(
          this.habilitationRepository,
          {
            ...rest,
          
          },
          Habilitations,
        );
        return result;
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const options: FindManyOptions<Habilitations> = {};
      const { relations } = pagination;
      if (pagination.relations) {
        options.relations = {};
      }

      if (relations) {
        options.relations = {
          ...options.relations,
          admissionsDischarges: {
            assignment: {
              inventoryHasAssigment: {
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
            },
          }
          
        };
      }
      const result = await paginationResult(
        this.habilitationRepository,
        {
          ...pagination,
          options,
        },
      );
      return result;
    } catch (error) {}
  }

  async findOne({
    term,
    relations,
    allRelations,
    deletes,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindManyOptions<Habilitations> = {};
      if (relations) {
        options.relations = {
          ...options.relations,
          admissionsDischarges: {
            assignment: {
              inventoryHasAssigment: {
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
            },
          },
        };
      }

      if (allRelations) {
        options.relations = {
          ...options.relations,
          admissionsDischarges: {
            assignment: {
              inventoryHasAssigment: {
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
            },
          },
        };
      }

      if (deletes) {
        options.withDeleted = true;
      }
      const result = findOneByTerm({
        repository: this.habilitationRepository,
        term,
        options,
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateHabilitationDto: UpdateHabilitationDto) {
    try {
      const { id, ...res } = updateHabilitationDto;
      return await runInTransaction(this.dataSource, async (queryRunner) => {
        const habilitationExist = await this.findOne({
          term: id,
        });

        const replace = Object.assign(habilitationExist, res);
        const result = await updateResult(
          this.habilitationRepository,
          id,
          replace,
          queryRunner,
        );
        return result;
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async remove(id: number, queryRunner?: QueryRunner) {
    try {
      const search = await this.findOne({ term: id });

      const idInventory = search.id;

      return deleteResult(
        this.habilitationRepository,
        idInventory,
        queryRunner,
      );
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOneSimple(id: number) {
    try {
      const result = await this.habilitationRepository.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
