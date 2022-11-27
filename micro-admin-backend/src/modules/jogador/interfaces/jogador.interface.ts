import { Document } from 'mongoose';
import { Categoria } from 'src/modules/categorias/interfaces/categoria.interface';

export interface Jogador extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  categoria: Categoria;
  ranking: string;
  positionRanking: number;
  urlPhotoJogador: string;
}
