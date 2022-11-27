import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { CategoriasSchema } from './interfaces/categoria.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from '../jogador/interfaces/jogador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriasSchema },
      { name: 'Jogador', schema: JogadorSchema },
    ]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
