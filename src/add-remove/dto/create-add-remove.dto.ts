import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ADD_REMOVE } from '../../common/constants/enums';

export class CreateAddRemoveDto {
  @IsString()
  @IsNotEmpty()
  motive: string;

  @IsString()
  @IsNotEmpty()
  observations: string;

  @IsEnum(ADD_REMOVE)
  type: ADD_REMOVE;
}
