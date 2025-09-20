import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryHasAssigment } from 'cts-entities';
import { FindOneOptions, In, Repository } from 'typeorm';

import {
  createResult,
  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  paginationResult,
  restoreResult,
} from 'src/common';

import { CreateHasAssignDto } from '../inventory-has-assign/dto/create-inventory-has-assign.dto';

import { AssignmentsService } from '../assignments.service';

import { InventoryService } from '../../inventory/inventory.service';
import { UpdateHasAssignDto } from './dto/update-inventory-has-assign.dto';

@Injectable()
export class InventoryHasAssignService {
  constructor(
    @InjectRepository(InventoryHasAssigment)
    private readonly inventoryHasAssignRepository: Repository<InventoryHasAssigment>,
    private readonly assignmentsService: AssignmentsService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(createDto: CreateHasAssignDto) {
    try {
      const { idActa, idInventory, type } = createDto;

      if (!Array.isArray(idInventory) || idInventory.length === 0) {
        throw new ErrorManager({
          message: 'El inventario debe ser un array',
          code: 'BAD_REQUEST',
        });
      }

      const inventoryActa = await this.findInventoryByActa(idActa, idInventory);

      if (inventoryActa) {
        throw new ErrorManager({
          message: 'Uno o más de los inventario ya existe en la acta',
          code: 'BAD_REQUEST',
        });
      }

      const inventoryExist =
        await this.inventoryService.findOneSimple(idInventory);

      const actaExist = await this.assignmentsService.finOneSimple(idActa);

      return await Promise.all(
        inventoryExist.map(async (i) => {
          await createResult(
            this.inventoryHasAssignRepository,
            {
              assignmentsReturns: actaExist,
              inventory: i,
              type,
            },
            InventoryHasAssigment,
          );
        }),
      );
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOneByActa({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<InventoryHasAssigment> = {
        where: { assignmentsReturns: { id: +term } },
        relations: { assignmentsReturns: true },
      };

      if (relations) {
        options.relations = {
          ...options.relations,
          inventory: true,
        };
      }

      if (allRelations) {
        options.relations = {
          ...options.relations,
          inventory: {
            state: true,
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

      const result = await paginationResult(this.inventoryHasAssignRepository, {
        all: true,
        options,
      });

      const data = result.data.map((el: InventoryHasAssigment) => {
        return {
          inventory: !relations
            ? {
                id: el.id,
                created_at: el.created_at,
                updated_at: el.updated_at,
                deleted_at: el.deleted_at,
              }
            : el.inventory,
        };
      });

      if (data.length <= 0) {
        throw new ErrorManager({
          message: 'NOT_FOUND',
          code: 'NOT_FOUND',
        });
      }

      return {
        ...result,
        data: {
          assign: result.data[0].assignmentsReturns.id,
          inventory_id: data,
        },
      };
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async restore(id: number) {
    try {
      return await restoreResult(this.inventoryHasAssignRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async delete(id: number) {
    return await deleteResult(this.inventoryHasAssignRepository, id);
  }

  async findInventoryByActa(idActa: number, idInventory: number[]) {
    try {
      const result = await this.inventoryHasAssignRepository.findOne({
        where: {
          assignmentsReturns: { id: idActa },
          inventory: { id: In(idInventory) },
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.inventoryHasAssignRepository.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateHasAssignDto: UpdateHasAssignDto) {
    try {
      const { id, idActa, idInventory, type, is_preassignment } =
        updateHasAssignDto;

      if (is_preassignment === true) {
        throw new ErrorManager({
          message: 'No se puede actualizar el inventario',
          code: 'NOT_MODIFIED',
        });
      }
      if (idInventory?.length === 0 || idInventory === undefined) {
        throw new ErrorManager({
          message: 'El inventario debe ser un array',
          code: 'BAD_REQUEST',
        });
      }
      const search = await this.inventoryHasAssignRepository.find({
        where: { assignmentsReturns: { id: idActa } },
        relations: { inventory: true },
      });

      //actualizar los inventarios, quitar los que no esten en el array
      await Promise.all(
        search.map(async (i) => {
          if (!idInventory?.includes(i.inventory.id)) {
            await this.inventoryService.remove(i.inventory.id);
          }
        }),
      );

      //agregar los inventarios que no existan en search y esten en idInventory
      await Promise.all(
        idInventory.map(async (i) => {
          const inventoryExist = await this.inventoryService.findOne({
            term: i,
          });
          if (!search.find((el) => el.inventory.id === i)) {
            await createResult(
              this.inventoryHasAssignRepository,
              {
                assignmentsReturns: { id: idActa },
                inventory: inventoryExist,
                type,
              },
              InventoryHasAssigment,
            );
          }
        }),
      );
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
