import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { createResult, deleteResult, ErrorManager, findOneByTerm, FindOneWhitTermAndRelationDto, PaginationRelationsDto, paginationResult, runInTransaction, updateResult } from 'src/common';
import { AssignmentsReturns as Assignments } from 'cts-entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { SearchDto } from 'src/common/dto/search.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignments)
    private readonly assignmentsRepository: Repository<Assignments>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    try {
      const { ...rest } = createAssignmentDto;
      const result = await createResult(
        this.assignmentsRepository,
        {
          ...rest,
        },
        Assignments,
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
      const options: FindManyOptions<Assignments> = {};
      if (relations) {
        if (pagination.relations) {
          options.relations = {};
        }

        options.relations = {
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
        };
      }

      const result = paginationResult(this.assignmentsRepository, {
        ...pagination,
        options,
      });
      return await result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<Assignments> = {};

      if (relations) {
        options.relations = {
          inventoryHasAssigment: {
            inventory: true,
          },
        };
      }
      if (allRelations) {
        options.relations = {
          inventoryHasAssigment: {
            inventory: {
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

      const result = await findOneByTerm({
        repository: this.assignmentsRepository,
        term,
        options,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  update(updateAssignmentDto: UpdateAssignmentDto) {
    try {
      const { id, ...res } = updateAssignmentDto;
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const assignment = await this.findOne({
          term: id,
          relations: true,
        });
        const replace = Object.assign(assignment, res);
        const result = await queryRunner.manager.save(Assignments, replace);

        return result;
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  remove(id: number) {
    try {
      return deleteResult(this.assignmentsRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async finOneSimple(id: number) {
    try {
      const result = await findOneByTerm({
        repository: this.assignmentsRepository,
        term: id,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findByTerm(searchDto: SearchDto) {
    try {
      const { project_id, user_id, date_init, date_end } = searchDto;

      const query = this.assignmentsRepository
        .createQueryBuilder('ad')
        .select();
      query.andWhere(`ad."type"::text like 'ASIGNACION'`);
      if (user_id) {
        query.andWhere('ad.user_id=:user', { user: user_id });
      }
      if (project_id) {
        query.andWhere('ad.project_id=:project', { project: project_id });
      }
      if (date_init && date_end) {
        query
          .andWhere('ad."date"::date >= :dateInit', { dateInit: date_init })
          .andWhere('ad."date"::date  <= :dateEnd', { dateEnd: date_end });
      } else if (date_init) {
        query.andWhere('ad.date::date  >= :dateInit::date', {
          dateInit: date_init,
        });
      }

      const result = await query.getMany();
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
