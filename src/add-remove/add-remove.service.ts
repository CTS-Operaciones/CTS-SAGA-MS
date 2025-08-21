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
        const { type, motive, observations } = createAddRemoveDto;

        const addRemove = await createResult(
          this.addRemovalRepository,
          {
            ...createAddRemoveDto,
            type: type,
            motive: motive,
            observations: observations,
          },
          addRemoval,
          queryRunner,
        );

        /** TODO: Agregar la funcion de creacion de firmas */

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

  async getChildrenByResource(idActa: number) {
    // Traemos todos los inventarios asociados a ese acta
    const rawInventories = await this.addRemovalRepository
      .createQueryBuilder('add')
      .leftJoin('add.inventoryHasAddRemoval', 'ihr')
      .leftJoin('ihr.inventory', 'inv')
      .leftJoin('inv.resource', 'res')
      .select([
        'res.id AS resourceId',
        'res.name AS resourceName',
        'inv.id AS inventoryId',
        'inv.idName AS idName',
        'inv.serialNumber AS serialNumber',
        'inv.status AS status',
        'inv.user_id AS userId',
        'inv.stateId AS stateId',
        'inv.resourceId AS resourceId',
        'inv.ubicationsId AS ubicationsId',
      ])
      .where('add.id = :idActa', { idActa })
      .getRawMany();

    const groupedByResource = rawInventories.reduce(
      (acc, row) => {
        const resourceId = row.resourceid;
        if (!acc[resourceId]) {
          acc[resourceId] = {
            resourceId: resourceId,
            resourceName: row.resourcename,
            childrens: [],
          };
        }

        acc[resourceId].childrens.push({
          inventoryId: row.inventoryid,
          idName: row.idname,
          serialNumber: row.serialnumber,
          status: row.status,
          userId: row.userid,
          stateId: row.stateid,
          resourceId: row.resourceid,
          ubicationsId: row.ubicationsid,
        });

        return acc;
      },
      {} as Record<number, any>,
    );

    return Object.values(groupedByResource);
  }
}
