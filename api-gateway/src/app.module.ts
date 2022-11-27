import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { JogadoresModule } from './modules/jogadores/jogadores.module';
import { ProxyrmqModule } from './modules/proxyrmq/proxyrmq.module';
import { AwsModule } from './modules/aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriasModule,
    JogadoresModule,
    ProxyrmqModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
