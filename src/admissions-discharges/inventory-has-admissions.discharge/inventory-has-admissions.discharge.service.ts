import { InjectRepository } from '@nestjs/typeorm';
import { admissionHasInventory} from 'cts-entities';
import { FindOneOptions, Repository } from 'typeorm';

import {

  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  paginationResult,
  restoreResult,
  STATUS_ENTRIES,
} from 'src/common';

import { CreateHasAdmissionDto} from './dto/create-inventory-has-admissions.discharge.dto';

import { AdmissionsDischargesService} from '../admissions-discharges.service';

import { InventoryService } from '../../inventory/inventory.service';

export class InventoryHasAdmissionService {
  constructor(
    @InjectRepository(admissionHasInventory)
    private readonly inventoryHasAdmissionRepository: Repository<admissionHasInventory>,
    private readonly admissionService: AdmissionsDischargesService,
    private readonly inventoryService: InventoryService,
  ) {}
  async create(createDto: CreateHasAdmissionDto) {
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
          const actaExist = await this.admissionService.findOneSimple(idActa);
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

          const result = await this.inventoryHasAdmissionRepository.save({
            AdmissionsDischarges: actaExist,
            inventory: inventoryExist,
          });

          if (actaExist.type === 'DISCHARGE') {
            await this.inventoryService.updateSatusInventory(
              STATUS_ENTRIES.AVAILABLE,
              idActa,
            );
          } else if (actaExist.type === 'ADMISSION') {
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
      const options: FindOneOptions<admissionHasInventory> = {
        where: { AdmissionsDischarges: { id: +term } },
        relations: { AdmissionsDischarges: true },
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

      const result = await paginationResult(this.inventoryHasAdmissionRepository, {
        all: true,
        options,
      });

      const data = result.data.map((el: admissionHasInventory) => {
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
          admissions: result.data[0].AdmissionsDischarges.id,
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
      return await restoreResult(this.inventoryHasAdmissionRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
  async delete(id: number) {
    return await deleteResult(this.inventoryHasAdmissionRepository, id);
  }

  async findInventoryByActa(idActa: number, idInventory: number) {
    try {
      const result = await this.inventoryHasAdmissionRepository.findOne({
        where: {
          AdmissionsDischarges: { id: idActa },
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
