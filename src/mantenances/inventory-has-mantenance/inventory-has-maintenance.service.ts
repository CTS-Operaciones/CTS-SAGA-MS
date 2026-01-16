import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryHasMaintenances, Maintenances } from 'cts-entities';
import { DataSource, FindOneOptions, In, Repository } from 'typeorm';
import {
  createResult,
  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  paginationResult,
  restoreResult,
  runInTransaction,
} from 'src/common';

import { CreateHasMaintenanceDto } from './dto/create-inventory-has-maintenance.dto';
import { MantenanceService } from '../mantenance.service';
import { InventoryService } from '../../inventory/inventory.service';

@Injectable()
export class InventoryHasMaintenanceservices {
  constructor(
    @InjectRepository(InventoryHasMaintenances)
    private readonly InventoryHasMaintenancesRepository: Repository<InventoryHasMaintenances>,
    private readonly MantenanceService: MantenanceService,
    private readonly inventoryService: InventoryService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateHasMaintenanceDto) {
    try {
      const { idActa, inventory } = createDto;

      if (!Array.isArray(inventory) || inventory.length === 0) {
        throw new ErrorManager({
          message: 'El inventario debe ser un array',
          code: 'BAD_REQUEST',
        });
      }

      const inventoryActa = await this.findInventoryByActa(idActa, inventory);

      if (inventoryActa) {
        throw new ErrorManager({
          message: 'Uno o más de los inventario ya existe en la acta',
          code: 'BAD_REQUEST',
        });
      }

      const inventoryExist =
        await this.inventoryService.findOneSimple(inventory);

      const actaExist = await this.MantenanceService.finOneSimple(idActa);

      await inventoryExist.map(async (i) => {
        await createResult(
          this.InventoryHasMaintenancesRepository,
          {
            maintenances: actaExist,
            inventory: i,
          },
          InventoryHasMaintenances,
        );
      });

      return inventoryExist;
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
      const options: FindOneOptions<InventoryHasMaintenances> = {
        where: { maintenances: { id: +term } },
        relations: { maintenances: true },
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
          maintenances: true,
        };
      }

      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(
        this.InventoryHasMaintenancesRepository,
        {
          all: true,
          options,
        },
      );

      const data = result.data.map((el: InventoryHasMaintenances) => {
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
          maintenances: result.data[0].maintenances.id,
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
      return await restoreResult(this.InventoryHasMaintenancesRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async delete(id: number) {
    return await deleteResult(this.InventoryHasMaintenancesRepository, id);
  }

  async findInventoryByActa(idActa: number, idInventory: number[]) {
    try {
      const result = await this.InventoryHasMaintenancesRepository.findOne({
        where: {
          maintenances: { id: idActa },
          inventory: { id: In(idInventory) },
        },
        relations: { maintenances: true },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.InventoryHasMaintenancesRepository.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async remove(id: number) {
    try {
      return runInTransaction(this.dataSource, async (queryRunner) => {
        const search = await this.InventoryHasMaintenancesRepository.find({
          where: { id },
        });

        if (search.length < 0) {
          throw new ErrorManager({
            message: 'No se encontró el elemento a eliminar',
            code: 'NOT_FOUND',
          });
        }

        return await this.InventoryHasMaintenancesRepository.delete(id);
      });
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async update(updateMantenanceDto: CreateHasMaintenanceDto) {
    try {
      const { idActa, inventory, ...rest } = updateMantenanceDto;

      const actaExist = await this.MantenanceService.findOne({ term: idActa });

      const search = await this.InventoryHasMaintenancesRepository.find({
        where: { maintenances: { id: idActa } },
        relations: { inventory: true },
      });

      let recursosExistentes = search.map((e) => e.inventory.id);

      let resourcesToDelete = search.filter(
        (rel) => !inventory?.includes(rel.inventory.id),
      );

      if (resourcesToDelete.length > 0) {
        for (const itemToDelete of resourcesToDelete) {
          await this.InventoryHasMaintenancesRepository.remove(itemToDelete);
        }
      }

      let resourcesToAdd = inventory?.filter(
        (newResource) => !recursosExistentes.includes(newResource),
      );

      if (resourcesToAdd.length > 0) {
        for (const itemToAdd of resourcesToAdd) {
          const inventoryE = await this.inventoryService.findOne({
            term: itemToAdd,
          });
          const result = this.InventoryHasMaintenancesRepository.create({
            inventory: inventoryE,
            maintenances: actaExist,
            ...rest,
          });

          const r = await this.InventoryHasMaintenancesRepository.save(result);

          return r;
        }
      }
      return search;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
