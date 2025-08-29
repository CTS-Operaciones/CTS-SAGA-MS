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
      const option: FindManyOptions<admissionsDischarges> = {};
      /*  if (pagination.relations) option.relations = {
        inventory: {
          resource: {
            clasification: true,
            model: true
          }
        }

      }; */
      const result = await paginationResult(
        this.admissionsDischargeRepository,
        {
          ...pagination,
          options: option,
        },
      );
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne(id: FindOneWhitTermAndRelationDto) {
    try {
      const option: FindManyOptions<admissionsDischarges> = {};
      /*   if (id.relations) option.relations = {
        inventory: {
          resource: {
            clasification: true,
            model: true
          }
        }
      } */
      const result = findOneByTerm({
        repository: this.admissionsDischargeRepository,
        term: id.term,
        options: option,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(UpdateAdmissionsDischargeDto: UpdateAdmissionsDischargeDto) {
    try {
      const { id, ...res } = UpdateAdmissionsDischargeDto;
      const admissionsDischargeExist = await findOneByTerm({
        repository: this.admissionsDischargeRepository,
        term: id,
      });
      Object.assign(admissionsDischargeExist, res);

      const result = await updateResult(
        this.admissionsDischargeRepository,
        id,
        admissionsDischargeExist,
      );
      return result;
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
