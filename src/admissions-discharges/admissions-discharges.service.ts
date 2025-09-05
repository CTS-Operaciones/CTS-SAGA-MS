import { Injectable } from '@nestjs/common';
import { CreateAdmissionsDischargeDto } from './dto/create-admissions-discharge.dto';
import { UpdateAdmissionsDischargeDto } from './dto/update-admissions-discharge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { admissionsDischarges } from 'cts-entities';
import { DataSource, FindManyOptions, Repository } from 'typeorm';

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
import { options } from 'joi';
import { find } from 'rxjs';

@Injectable()
export class AdmissionsDischargesService {
  constructor(
    @InjectRepository(admissionsDischarges)
    private readonly admissionsDischargeRepository: Repository<admissionsDischarges>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createAdmissionsDischargeDto: CreateAdmissionsDischargeDto) {
    try {
      return runInTransaction(this.dataSource, async (manager) => {
        const { type, ...rest } = createAdmissionsDischargeDto;
        const result = await createResult(
          this.admissionsDischargeRepository,
          {
            ...rest,
            type,
          },
          admissionsDischarges,
        );
        return result;
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const options: FindManyOptions<admissionsDischarges> = {};
      const { relations } = pagination;
      if (pagination.relations) {
        options.relations = {};
      }

      if (relations) {
        options.relations = {
          ...options.relations,
          admissionsHasInventory: {
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
      const result = await paginationResult(
        this.admissionsDischargeRepository,
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
      const options: FindManyOptions<admissionsDischarges> = {};
      if (relations) {
        options.relations = {
          ...options.relations,
          admissionsHasInventory: {
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
      if (allRelations) {
        options.relations = {
          ...options.relations,
          admissionsHasInventory: {
            inventory: {
              ubications: true,
              state: true,
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

      if (deletes) {
        options.withDeleted = true;
      }
      const result = findOneByTerm({
        repository: this.admissionsDischargeRepository,
        term: term,
        options: options,
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(UpdateAdmissionsDischargeDto: UpdateAdmissionsDischargeDto) {
    try {
      const { id, ...res } = UpdateAdmissionsDischargeDto;

      return await runInTransaction(this.dataSource, async (queryRunner) => {
        const admissionsDischargeExist = await this.findOne({
          term: id,
          relations: true,
        });
        Object.assign(admissionsDischargeExist, res);

        const result = await updateResult(
          this.admissionsDischargeRepository,
          id,
          admissionsDischargeExist[0].data[0],
          queryRunner,
        );
        return result;
      });
    } catch (error) {}
  }

  remove(id: number) {
    try {
      return deleteResult(this.admissionsDischargeRepository, id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOneSimple(id: number) {
    try {
      const result = await this.admissionsDischargeRepository.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
