import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Post } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { Observable } from 'rxjs';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('api/v1')
export class AppController {
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ],
        queue: 'admin-backend',
      },
    });
  }

  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  @Post('categorias')
  @UsePipes(ValidationPipe)
  createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', createCategoriaDto);
  }

  @Get('/categorias')
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('/categorias/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() updateCategoriaDto: UpdateCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: updateCategoriaDto,
    });
  }
}
