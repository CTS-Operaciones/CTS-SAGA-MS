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
} from 'src/common';

import { CreateHasAssignDto} from '../inventory-has-assign/dto/create-inventory-has-assign.dto';
import { ResourcesService } from '../../resources/resources.service';
import { AssignmentsService } from '../assignments.service';

export class InventoryHasAssignService {
  constructor(
    @InjectRepository(InventoryHasAssigment)
    private readonly inventoryHasAssignRepository: Repository<InventoryHasAssigment>,
    private readonly resourceService: ResourcesService,
    private readonly assignmentsService: AssignmentsService,
  ) {}
  async create(createDto: CreateHasAssignDto) {
    try {
      const { resource: _resource, idActa, ...rest } = createDto;

      const assignmentsReturns = await this.assignmentsService.findOne({
        term: idActa,
      });

      const resource = await this.resourceService.findOneByName(_resource);

      let inventoryCreated: InventoryHasAssigment | null;

      inventoryCreated = await this.inventoryHasAssignRepository.findOne({
        where: {
          assignmentsReturns,
          inventory: {
            idName: rest.idName,
            serialNumber: rest.serialNumber,
            resource: { id: resource.id },
          },
        },
        relations: { assignmentsReturns: true },
        withDeleted: true,
      });

      if (inventoryCreated) {
        return inventoryCreated.deleted_at
          ? await restoreResult(
              this.inventoryHasAssignRepository,
              inventoryCreated.id,
            )
          : inventoryCreated;
      }

      inventoryCreated = await createResult(
        this.inventoryHasAssignRepository,
        {
          assignmentsReturns,
          inventory: {
            idName: rest.idName,
            serialNumber: rest.serialNumber,
            resource,
          },
        },
        InventoryHasAssigment,
      );

      return inventoryCreated;
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
              model: true,
            },
          },
        };
      }

      if (deletes) {
        options.withDeleted = true;
      }

      const result = await paginationResult(
        this.inventoryHasAssignRepository,
        {
          all: true,
          options,
        },
      );

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
}
