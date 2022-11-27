import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './modules/jogador/interfaces/jogador.schema';
import { JogadorModule } from './modules/jogador/jogador.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { CategoriasSchema } from './modules/categorias/interfaces/categoria.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriasSchema },
      { name: 'Jogador', schema: JogadorSchema },
    ]),
    JogadorModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
