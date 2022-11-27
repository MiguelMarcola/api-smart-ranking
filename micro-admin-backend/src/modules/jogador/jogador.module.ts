import { Module } from '@nestjs/common';
import { JogadorService } from './jogador.service';
import { JogadorController } from './jogador.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogador.schema';
import { CategoriasSchema } from '../categorias/interfaces/categoria.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Jogador', schema: JogadorSchema },
      { name: 'Categoria', schema: CategoriasSchema },
    ]),
  ],
  controllers: [JogadorController],
  providers: [JogadorService],
})
export class JogadorModule {}
