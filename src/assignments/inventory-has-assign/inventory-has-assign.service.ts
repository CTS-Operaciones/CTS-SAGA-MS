import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryHasAssigment } from 'cts-entities';
import { FindOneOptions, Repository } from 'typeorm';

import {
  createResult,
  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  paginationResult,
  restoreResult,
  STATUS_ENTRIES,
} from 'src/common';

import { CreateHasAssignDto } from '../inventory-has-assign/dto/create-inventory-has-assign.dto';

import { AssignmentsService } from '../assignments.service';

import { InventoryService } from '../../inventory/inventory.service';

export class InventoryHasAssignService {
  constructor(
    @InjectRepository(InventoryHasAssigment)
    private readonly inventoryHasAssignRepository: Repository<InventoryHasAssigment>,
    private readonly assignmentsService: AssignmentsService,
    private readonly inventoryService: InventoryService,
  ) {}
  async create(createDto: CreateHasAssignDto) {
    try {
      const { idActa, idInventory } = createDto;

      if (!Array.isArray(idInventory) || idInventory.length === 0) {
        throw new ErrorManager({
          message: 'El inventario debe ser un array',
          code: 'BAD_REQUEST',
        });
      }

      const results = await Promise.all(
        idInventory.map(async (i) => {
          const inventoryExist = await this.inventoryService.findOneSimple(i);
          const actaExist = await this.assignmentsService.finOneSimple(idActa);

          if (!inventoryExist || !actaExist) {
            throw new ErrorManager({
              message: `Id ${i} o ${idActa} no existen`,
              code: 'NOT_FOUND',
            });
          }

          const inventoryActa = await this.findInventoryByActa(idActa, i);

          if (inventoryActa) {
            throw new ErrorManager({
              message: `El inventario con ID ${i} ya ha sido dado de baja en otra acta`,
              code: 'BAD_REQUEST',
            });
          }

          const result = await this.inventoryHasAssignRepository.save({
            assignmentsReturns: actaExist,
            inventory: inventoryExist,
          });

          if (actaExist.type === 'DEVOLUCION') {
            await this.inventoryService.updateSatusInventory(
              STATUS_ENTRIES.AVAILABLE,
              idActa,
            );
          } else if (actaExist.type === 'ASIGNACION') {
            await this.inventoryService.updateSatusInventory(
              STATUS_ENTRIES.IN_USE,
              idActa,
            );
          }

          return result;
        }),
      );

      return results;
    } catch (error) {
      console.log(error);
      throw Error;
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

  async findInventoryByActa(idActa: number, idInventory: number) {
    try {
      const result = await this.inventoryHasAssignRepository.findOne({
        where: {
          assignmentsReturns: { id: idActa },
          inventory: { id: idInventory },
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
