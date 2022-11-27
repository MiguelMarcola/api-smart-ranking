import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('api/v1')
export class CategoriasController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private logger = new Logger(CategoriasController.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

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
