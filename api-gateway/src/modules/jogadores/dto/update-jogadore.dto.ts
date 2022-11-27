import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateJogadoreDto } from './create-jogadore.dto';

export class UpdateJogadoreDto extends PartialType(CreateJogadoreDto) {
  @IsNotEmpty()
  readonly phoneNumber?: string;

  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  categoria?: string;

  @IsOptional()
  urlAvatar?: string;
}
