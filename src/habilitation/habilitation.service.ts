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
  paginationArray,
  PaginationDto,
  PaginationRelationsDto,
  paginationResult,
  runInTransaction,
  updateResult,
} from 'src/common';
import { AdmissionsDischargesService } from 'src/admissions-discharges/admissions-discharges.service';
import { SearchDto } from '../common/dto/search.dto';

@Injectable()
export class HabilitationService {
  constructor(
    @InjectRepository(Habilitations)
    private readonly habilitationRepository: Repository<Habilitations>,
    private readonly dataSource: DataSource,
    private readonly admissionsDischargesService: AdmissionsDischargesService,
  ) {}

  async create(createHabilitationDto: CreateHabilitationDto) {
    try {
      return runInTransaction(this.dataSource, async (manager) => {
        const { admissionsDischarge, ...rest } = createHabilitationDto;

        const admissionsExist = await this.admissionsDischargesService.findOne({
          term: admissionsDischarge,
        });
        const result = await createResult(
          this.habilitationRepository,
          {
            admissionsDischarges: admissionsExist,
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
  async findByTerm({
    pagination,
    searchDto,
  }: {
    searchDto: SearchDto;
    pagination: PaginationDto;
  }) {
    try {
      const { project_id, user_id, date_init, date_end } = searchDto;

      const { limit: limitP, page: pageP, all } = pagination;

      const limit = limitP ? limitP : 10;
      const page = pageP ? pageP : 1;

      const query = this.habilitationRepository
        .createQueryBuilder('h')
        .leftJoin('h.admissionsDischarges', 'ad')
        .select();
      if (user_id) {
        query.andWhere('ad.user_id=:user', { user: user_id });
      }
      if (project_id) {
        query.andWhere('ad.project_id=:project', { project: project_id });
      }
      if (date_init && date_end) {
        query
          .andWhere('h.fecha::date >= :dateInit', { dateInit: date_init })
          .andWhere('h.fecha::date  <= :dateEnd', { dateEnd: date_end });
      } else if (date_init) {
        query.andWhere('h.fecha::date  >= :dateInit::date', {
          dateInit: date_init,
        });
      }

      const r = await query.getRawMany();

      const result = paginationArray(r, page, limit);

      return result;
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
          },
        };
      }
      const result = await paginationResult(this.habilitationRepository, {
        ...pagination,
        options,
      });
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

  async findOneHabilitationByAssigment(id: number) {
    try {
      const query = this.habilitationRepository
        .createQueryBuilder('h')
        .leftJoin('h.admissionsDischarges', 'ad')
        .leftJoin('ad.assignment', 'a')
        .andWhere('a.id=:id', { id: id })
        .select();
      const result = await query.getMany();
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
