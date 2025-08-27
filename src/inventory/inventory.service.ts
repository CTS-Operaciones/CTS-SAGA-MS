import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, Resource, State, Ubications } from 'cts-entities';
import { FindManyOptions, FindOneOptions, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ADD_REMOVE } from '../common/constants/enums';

import {
  createResult,
  deleteResult,
  ErrorManager,
  findOneByTerm,
  FindOneWhitTermAndRelationDto,
  msgError,
  PaginationFilterAssigmentsDto,
  paginationResult,
  updateResult,
} from 'src/common';

import { StateService } from 'src/state/state.service';
import { UbicationsService } from 'src/ubications/ubications.service';
import { ResourcesService } from 'src/resources/resources.service';
import { aumentarStock, disminuirStock } from 'src/common/helpers/modifyStock';
import { find, generate, throwError } from 'rxjs';

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
      let resourceExist: any = null;
      let ubicationExist: any = null;
      let stateExist: any = null;

      if (
        createInventoryDto.status ||
        createInventoryDto.resource ||
        createInventoryDto.ubications
      ) {
        1;
        if (createInventoryDto.state) {
          stateExist = await this.stateServices.findOne(
            createInventoryDto.state,
          );
        }

        if (createInventoryDto.ubications) {
          ubicationExist = await this.ubicationsService.findOne(
            createInventoryDto.ubications,
          );
        }
      }
      if (!createInventoryDto.resource) {
        throw throwError(
          () =>
            new Error(
              'El recurso es obligatorio para la creacion del inventario',
            ),
        );
      }
      if (createInventoryDto.resource) {
        const resourceData = await this.resourcesService.findOne({
          term: createInventoryDto.resource,
          relations: true,
        });
        resourceExist = resourceData?.data?.[0] ?? null;
      }

      if (!resourceExist || resourceExist === null) {
        throw new ErrorManager({
          message: msgError('NOT_FOUND_RESOURCE'),
          code: 'NOT_FOUND',
        });
      }

      const inventoryToCreate = {
        ...createInventoryDto,
        state: stateExist ?? undefined,
        ubications: ubicationExist ?? undefined,
        resource: resourceExist,
      };

      const result = await createResult(
        this.inventoryRepository,
        inventoryToCreate,
        Inventory,
      );

      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(
    pagination: PaginationFilterAssigmentsDto<Inventory>,
    type = ADD_REMOVE,
  ) {
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
        relations: {
          ubications: true,
          state: true,
          resource: {
            clasification: true,
            model: true,
          },
        },
      };

      if (deletes) {
        option.withDeleted = true;
      }

      const result = await findOneByTerm({
        repository: this.inventoryRepository,
        options: option,
        term,
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

      let ubicationExist: Ubications | undefined = undefined;

      if (rest.ubications && rest.ubications !== inventory.ubications?.id) {
        ubicationExist = await this.ubicationsService.findOne(rest.ubications);
      }

      let stateExist: State | undefined = undefined;
      if (rest.state && rest.state !== inventory.state?.id) {
        stateExist = await this.stateServices.findOne(rest.state);
      }

      let resourceExist: Resource | undefined = undefined;

      if (rest.resource && rest.resource !== inventory.resource?.id) {
        const resourceData = await this.resourcesService.findOne({
          term: rest.resource,
          relations: true,
        });
        resourceExist = resourceData?.data?.[0] ?? null;
      }
      const result = await updateResult(this.inventoryRepository, id, {
        ...rest,
        ubications: ubicationExist,
        state: stateExist,
        resource: resourceExist,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.inventoryRepository.delete(id);
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findOneSimple(id: number) {
    try {
      const result = await this.inventoryRepository.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}

