import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryHasAddRemoval, STATUS_ENTRIES } from 'cts-entities';
import { FindOneOptions, Repository, DataSource } from 'typeorm';

import {
  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  paginationResult,
  restoreResult,
  runInTransaction,
} from 'src/common';

import {
  CreateHasAddRemoveDto,
  CreateRemoveDto,
} from '../inventory-has-add/dto/create-inventory-has-add-remove.dto';

import { AddRemoveService } from '../add-remove.service';
import { InventoryService } from 'src/inventory/inventory.service';



@Injectable()
export class InventoryHasAddService {
  constructor(
    @InjectRepository(InventoryHasAddRemoval)
    private readonly inventoryHasAddRemovalRepository: Repository<InventoryHasAddRemoval>,
    private readonly addRemoveService: AddRemoveService,
    private readonly inventoryService: InventoryService,
    private readonly dataSource: DataSource,
  ) {}
  async create(createDto: CreateHasAddRemoveDto) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const { idActa, resource } = createDto;

        for (const r of resource) {
          const { idResource, quantity } = r;

          for (let i = 0; i < quantity; i++) {
            const registro = this.inventoryService.create({
              status: STATUS_ENTRIES.AVAILABLE,
              resource: idResource,
            });
            const { id } = await registro;
            await this.inventoryHasAddRemovalRepository.save({
              addRemoval: { id: idActa },
              inventory: { id: id },
            });
          }

          await this.inventoryService.aumentarStock(idResource, quantity);
          const resourceData = await this.addRemoveService.findOne({
            term: idActa,
          });

          return {
            message: 'Inventario creado con exito',
          };
        }
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async createRemove(createDto: CreateRemoveDto) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const { idActa, idInventory } = createDto;

        for (const i of idInventory) {
          const inventoryE = await this.findINventoryInActa(idActa, i);

          if (inventoryE) {
            throw new ErrorManager({
              message: `El inventario con ID ${i} ya existe en otra acta`,
              code: 'BAD_REQUEST',
            });
          }
          const inventoryExist = await this.inventoryService.findOne({
            term: i,
          });
          if (inventoryExist) {
            await this.inventoryHasAddRemovalRepository.save({
              addRemoval: { id: idActa },
              inventory: { id: i },
            });
          }
        }
      });
    } catch (error) {}
  }

  async findOneByActa({
    term,
    deletes,
    relations,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const options: FindOneOptions<InventoryHasAddRemoval> = {
        where: { addRemoval: { id: +term } },
        relations: { addRemoval: true },
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
              model: true,
            },
          },
        };
      }

      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(
        this.inventoryHasAddRemovalRepository,
        {
          all: true,
          options,
        },
      );

      const data = result.data.map((el: InventoryHasAddRemoval) => {
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
          addRemoval: result.data[0].addRemoval.id,
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
      return await restoreResult(this.inventoryHasAddRemovalRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async deletePositions(id: number) {
    return await deleteResult(this.inventoryHasAddRemovalRepository, id);
  }

  async getResourcesByActa(id: number) {
    try {
      const result = await this.inventoryHasAddRemovalRepository.find({
        where: { addRemoval: { id } },
        relations: {
          inventory: {
            resource: true,
          },
        },
      });

      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findINventoryInActa(id: number, inventoryId: number) {
    try {
      let result;
      const isExist = await this.inventoryHasAddRemovalRepository.findOne({
        where: { addRemoval: { id }, inventory: { id: inventoryId } },
      });
      isExist ? (result = true) : (result = false);
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
  //Eliminar el acta completa y los items del inventario
  async removeActa(id: number) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const acta = await this.addRemoveService.findOne({ term: id });

        const search = await this.inventoryHasAddRemovalRepository.find({
          where: { addRemoval: { id: acta.id } },
          relations: { inventory: true },
        });

        for (const item of search) {
          const { id, inventory } = item;
          const idInventory = inventory.id;
          console.log(idInventory);

          await deleteResult(
            this.inventoryHasAddRemovalRepository,
            id,
            queryRunner,
          );

          await this.inventoryService.remove(inventory.id, queryRunner);
        }

        const result = await this.addRemoveService.remove(id, queryRunner);

        return result;
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
  async removeItem(id: number) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const result = await this.inventoryHasAddRemovalRepository.find({
          where: { id },
          relations: { inventory: true },
        });
        const idInventory = result[0].inventory;
        if (idInventory === null) {
          throw new ErrorManager({
            message:
              'El recurso no se encuentra en el inventario o ya ha sido eliminado',
            code: 'NOT_FOUND',
          });
        }
        console.log(idInventory);
        if (result) {
          await deleteResult(
            this.inventoryHasAddRemovalRepository,
            id,
            queryRunner,
          );

          await this.inventoryService.remove(
            result[0].inventory.id,
            queryRunner,
          );
        } else {
          throw new ErrorManager({
            message: 'NOT_FOUND',
            code: 'NOT_FOUND',
          });
        }

        return result;
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
