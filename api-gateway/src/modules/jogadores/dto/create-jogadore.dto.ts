import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateJogadoreDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly categoria: string;
}
