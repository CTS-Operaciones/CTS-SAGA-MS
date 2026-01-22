import { Injectable } from '@nestjs/common';
import { CreateMantenanceDto } from './dto/create-mantenance.dto';
import { UpdateMantenanceDto } from './dto/update-mantenance.dto';
import { Maintenances as Mantenance } from 'cts-entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { searchMaintenanceDto } from 'src/common/dto/search.dto';
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
import { resourceLimits } from 'worker_threads';
import { object } from 'joi';
@Injectable()
export class MantenanceService {
  constructor(
    @InjectRepository(Mantenance)
    private readonly MantenanceRepository: Repository<Mantenance>,
    private readonly dataSource: DataSource,
  ) {}

  async create(CreateMantenanceDto: CreateMantenanceDto) {
    try {
      const { ...rest } = CreateMantenanceDto;
      const result = await createResult(
        this.MantenanceRepository,
        {
          ...rest,
        },
        Mantenance,
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
      const options: FindManyOptions<Mantenance> = {};
      if (relations) {
        if (pagination.relations) {
          options.relations = {};
        }

        options.relations = {
          inventoryHasMaintenances: {
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

      const result = paginationResult(this.MantenanceRepository, {
        ...pagination,
        options,
      });
      return await result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async getMaintenanceDetails(id: number) {

    const query = this.MantenanceRepository.createQueryBuilder('maintenance')
      .leftJoin('maintenance.inventoryHasMaintenances', 'ihm')
      .leftJoin('ihm.inventory', 'inv')
      .leftJoin('inv.resource', 'res')
      .leftJoin('inv.ubications', 'ubi')
      .leftJoin('res.clasification', 'clasification')
      .leftJoin('res.model', 'model')
      .leftJoin('model.brand', 'brand')
      .leftJoin('employees', 'e', 'maintenance.responsible = e.id')
      .leftJoin('projects', 'p', 'maintenance."projectId" = p.id')
      .withDeleted()
      .select([
        'maintenance.id',
        'maintenance.id AS maintenance_id',
        'maintenance.description AS maintenance_description',
        'maintenance.maintenanceType',
        'maintenance.date_init',
        'maintenance.date_end',
        'brand.id AS brandId',
        'brand.name AS brandName',
        'model.id AS modelId',
        'model.name AS modelName',
        'clasification.id AS clasificationId',
        'clasification.name AS clasificationName',
        'res.id AS resourceId',
        'res.name AS resourceName',
        'inv.id AS inventoryId',
        'inv.serialNumber AS serial',
        'e.id AS userId',
        'e.names AS userName',
        'p.id AS projectId',
        'p.name AS projectName',
      ]);
  
    query.orderBy('maintenance.id', 'DESC');
    const r = await query.getRawMany();
    console.log('data:',r);
    return r
  
  }
  async findOne({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<Mantenance> = {};

      if (relations) {
        options.relations = {
          inventoryHasMaintenances: {
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
      if (allRelations) {
        options.relations = {
          inventoryHasMaintenances: {
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

      const result = await findOneByTerm({
        repository: this.MantenanceRepository,
        term,
        options,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  update(updateMantenanceDto: UpdateMantenanceDto) {
    try {
      const { id, ...res } = updateMantenanceDto;
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const mantenance = await this.findOne({
          term: id,
          relations: true,
        });
        const replace = Object.assign(mantenance, res);
        const result = await queryRunner.manager.save(Mantenance, replace);

        return result;
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  remove(id: number) {
    try {
      return deleteResult(this.MantenanceRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async finOneSimple(id: number) {
    try {
      const result = await findOneByTerm({
        repository: this.MantenanceRepository,
        term: id,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findByTerm({
    pagination,
    searchDto,
  }: {
    searchDto: searchMaintenanceDto;
    pagination: PaginationDto;
  }) {
    try {
      const {
        project_id,
        user_id,
        date_init,
        date_end,
        description,
        observations,
        maintenanceType,
      } = searchDto;
      const { limit: limitP, page: pageP, all } = pagination;

      const limit = limitP ? limitP : 10;
      const page = pageP ? pageP : 1;
      const query =
        this.MantenanceRepository.createQueryBuilder('maintenance').select();

      if (user_id) {
        query.andWhere('maintenance.user_id=:user', { user: user_id });
      }
      if (project_id) {
        query.andWhere('maintenance.projectId=:project', {
          project: project_id,
        });
      }
      if (date_init && date_end) {
        query
          .andWhere('maintenance."date_init"::date >= :dateInit', {
            dateInit: date_init,
          })
          .andWhere('maintenance."date_end"::date  <= :dateEnd', {
            dateEnd: date_end,
          });
      } else if (date_init) {
        query.andWhere('maintenance.date_init::date  = :dateInit::date', {
          dateInit: date_init,
        });
      }
      if (description) {
        query.andWhere(
          `maintenance."description"::text like '%${description}%'`,
        );
      }
      if (observations) {
        query.andWhere(
          `maintenance."observations"::text like '%${observations}%'`,
        );
      }

      if (maintenanceType) {
        query.andWhere(
          `maintenance."maintenanceType"::text like '%${maintenanceType}%'`,
        );
      }

      const r = await query.getRawMany();
      const result = paginationArray(r, page, limit);
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}
