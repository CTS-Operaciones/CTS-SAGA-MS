import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, Ubications } from 'cts-entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  createResult,
  deleteResult,
  ErrorManager,
  FindOneWhitTermAndRelationDto,
  PaginationFilterAssigmentsDto,
  paginationResult,
  updateResult,
} from 'src/common';

import { StateService } from 'src/state/state.service';
import { UbicationsService } from 'src/ubications/ubications.service';
import { ResourcesService } from 'src/resources/resources.service';
import { aumentarStock, disminuirStock } from 'src/common/helpers/modifyStock';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly stateServices: StateService,
    private readonly ubicationsService: UbicationsService,
    private readonly resourcesService: ResourcesService,
  ) {}
  async create(createInventoryDto: CreateInventoryDto) {
    try {
      const { ubications, resourceId, stateId, ...CreateInventoryDto } =
        createInventoryDto;

      let resourceExist: any, ubicationExist: any, stateExist: any;
      stateId
        ? (stateExist = await this.stateServices.findOne(stateId))
        : (stateExist = null);

      ubications
        ? (ubicationExist = await this.ubicationsService.findOne(ubications))
        : (ubicationExist = null);

      resourceId
        ? (resourceExist = await this.resourcesService.findOne({
            term: resourceId,
            relations: true,
          }))
        : (resourceExist = null);

      const data = resourceExist.data[0];

      console.log(data);
      //Agregar relacion con staff user_id

      const result = await createResult(
        this.inventoryRepository,
        {
          ...CreateInventoryDto,
          ubications: ubicationExist,
          state: stateExist,
          resource: data,
        },
        Inventory,
      );

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationFilterAssigmentsDto<Inventory>) {
    try {
      const option: FindManyOptions<Inventory> = {};
      if (pagination.relations)
        if (pagination.status) {
          option.where = { status: pagination.status };
        }
      option.relations = {
        state: true,
        resource: {
          clasification: true,
          model: true,
        },
      };
      const result = await paginationResult(this.inventoryRepository, {
        ...pagination,
        options: option,
      });
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOne({
    term,
    relations,
    deletes,
    allRelations,
  }: FindOneWhitTermAndRelationDto) {
    try {
      const option: FindOneOptions<Inventory> = {
        where: { id: +term },
        relations: {
          ubications: true,
          state: true,
          resource: {
            clasification: true,
            model: true,
          },
        },
      };
      if (relations) {
        option.relations = {
          ...option.relations,
          ubications: true,
          resource: true,
        };
      }
      if (allRelations) {
        option.relations = {
          ubications: true,
          state: true,
          resource: {
            clasification: true,
            model: true,
          },
        };
      }
      if (deletes) {
        option.withDeleted = true;
      }
      const result = await paginationResult(this.inventoryRepository, {
        all: true,
        options: option,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateInventoryDto: UpdateInventoryDto) {
    try {
      const { id, ...rest } = updateInventoryDto;
      const inventory = await this.findOne({
        term: id,
        relations: true,
      });
      console.log(inventory.data[0].ubications);
      if (
        rest.ubications &&
        rest.ubications !== inventory.data[0].ubications.id
      ) {
        const ubicationExist = await this.findOne({
          term: rest.ubications,
        });
        inventory.data[0].ubications[0] = ubicationExist;
      }
      Object.assign(inventory, rest);
      console.log(inventory[0].data);
      const result = await updateResult(
        this.inventoryRepository,
        id,
        inventory[0].data,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async remove(id: number) {
    try {
      await disminuirStock(id);
      return await deleteResult(this.inventoryRepository, id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }
}

