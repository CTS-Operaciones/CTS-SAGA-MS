import { Injectable } from '@nestjs/common';
import { CreateUbicationDto } from './dto/create-ubication.dto';
import { UpdateUbicationDto } from './dto/update-ubication.dto';
import {
  createResult,
  deleteResult,
  ErrorManager,
  findOneByTerm,
  PaginationDto,
  paginationResult,
  updateResult,
} from 'src/common';
import { Ubications as Ubication } from 'cts-entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UbicationsService {
  constructor(
    @InjectRepository(Ubication)
    private readonly ubicationsRepository: Repository<Ubication>,
  ) {}
  create(createUbicationDto: CreateUbicationDto) {
    try {
      const result = createResult(
        this.ubicationsRepository,
        createUbicationDto,
        Ubication,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const result = await paginationResult(
        this.ubicationsRepository,
        pagination,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  findOne(term: number) {
    try {
      const result = findOneByTerm({
        repository: this.ubicationsRepository,
        term,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }

  async update(updateUbicationDto: UpdateUbicationDto) {
    const { id, ...res } = updateUbicationDto;
    const ubicationExist = await this.findOne(id);
    Object.assign(ubicationExist, res);
    const result = updateResult(this.ubicationsRepository, id, ubicationExist);
    return result;
  }

  async remove(id: number) {
    try {
      return await deleteResult(this.ubicationsRepository, id);
    } catch (error) {
      console.log(error);
      throw ErrorManager.createSignatureError(error);
    }
  }
}
