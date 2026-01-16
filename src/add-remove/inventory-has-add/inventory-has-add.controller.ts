import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InventoryHasAddService } from './inventory-has-add.service';
import { CreateHasAddRemoveDto } from './dto/create-inventory-has-add-remove.dto';
import { FindOneWhitTermAndRelationDto } from 'src/common';

@Controller()
export class InventoryHasAddController {
  constructor(private readonly addRemoveService: InventoryHasAddService) {}
  @MessagePattern('createInventoryHasAdd')
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Create a new inventory with the given acta and inventory.
   * @param {CreateHasAddRemoveDto} createAddRemoveDto - The data for the new inventory.
   * @returns {Promise<CreateHasAddRemoveDto>} - The created inventory.
   * @throws {RpcException} - If there is an error creating the inventory.
   */
  /*******  9ca2c80c-22ed-44c5-b843-ec644c39f21c  *******/
  create(@Payload() createAddRemoveDto: CreateHasAddRemoveDto) {
    try {
      console.log(createAddRemoveDto);
      return this.addRemoveService.create(createAddRemoveDto);
    } catch (error) {
      console.error('❌ Error en el controlador:', error);
      throw new RpcException(error.message || 'Error desconocido');
    }
  }
  @MessagePattern('getResourcesByActa')
  get(@Payload() { id }: { id: number }) {
    return this.addRemoveService.getResourcesByActa(id);
  }
  @MessagePattern('findOneInventoryHasAdd')
  findOne(
    @Payload()
    { term, deletes, relations, allRelations }: FindOneWhitTermAndRelationDto,
  ) {
    return this.addRemoveService.findOneByActa({
      term,
      relations,
      deletes,
      allRelations,
    });
  }

  @MessagePattern('removeInventoryHasAdd')
  remove(@Payload() { id }: { id: number }) {
    return this.addRemoveService.removeActa(id);
  }
}
