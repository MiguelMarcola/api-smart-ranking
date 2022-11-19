import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogador/jogador.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:s3cr3t@cluster-api-smartrankin.4nb9now.mongodb.net/sradminbackend?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriasSchema },
      { name: 'Jogador', schema: JogadorSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
