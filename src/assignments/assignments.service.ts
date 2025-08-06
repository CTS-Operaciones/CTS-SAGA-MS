import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { createResult, deleteResult, ErrorManager, findOneByTerm, FindOneWhitTermAndRelationDto, PaginationRelationsDto, paginationResult, runInTransaction, updateResult } from 'src/common';
import { AssignmentsReturns as Assignments } from 'cts-entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignments)
    private readonly assignmentsRepository: Repository<Assignments>,
    private readonly dataSource: DataSource,
  ) {}
  create(createAssignmentDto: CreateAssignmentDto) {
    try {
      return runInTransaction(this.dataSource, async (manager) => {
        const { type, ...rest } = createAssignmentDto;
        const result = await createResult(
          this.assignmentsRepository,
          {
            ...rest,
            type,
          },
          Assignments,
        );
        return result;
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationRelationsDto) {
    try {
      const options: FindManyOptions<Assignments> = {};
      if (pagination.relations) options.relations = {};
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
      const options: FindOneOptions<Assignments> = {
        where: { id: +term },
        relations: {
          inventoryHasAssigment: {
            inventory: true,
          },
        },
      };

      if (relations || allRelations) {
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
                model: true,
              },
            },
          },
        };
      }
      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(this.assignmentsRepository, {
        all: true,
        options,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  //Todo: Corregir
  update(updateAssignmentDto: UpdateAssignmentDto) {
    try {
      const { id, ...res } = updateAssignmentDto;
      return runInTransaction(this.dataSource, async (manager) => {
        const assignment = await this.findOne({
          term: id,
          relations: true,
        });
        Object.assign(assignment, res);
        const result = await updateResult(
          this.assignmentsRepository,
          id,
          assignment[0].data[0],
        );

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
}
