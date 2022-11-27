import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { Post } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { CreateJogadoreDto } from './dto/create-jogadore.dto';
import { UpdateJogadoreDto } from './dto/update-jogadore.dto';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros-pipe';
import { lastValueFrom, Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';
import { AwsService } from '../aws/aws.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private logger = new Logger(JogadoresController.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createJogadorDto: CreateJogadoreDto) {
    this.logger.log(`CriarJogadorDto: ${JSON.stringify(createJogadorDto)}`);
    const categoria$ = this.clientAdminBackend.send(
      'consultar-categorias',
      createJogadorDto.categoria,
    );
    const categoria = await lastValueFrom(categoria$);

    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', createJogadorDto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('_id') _id: string) {
    const jogador$ = this.clientAdminBackend.send('consultar-jogadores', _id);
    const jogador = await lastValueFrom(jogador$);

    if (!jogador) {
      throw new BadRequestException('Jogador não encontrado');
    }

    const ulrAvatar = await this.awsService.uploadFile(file, _id);
    const updateJogadorDto: UpdateJogadoreDto = {};
    updateJogadorDto.urlAvatar = ulrAvatar.url;

    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: updateJogadorDto,
    });

    return this.clientAdminBackend.send('consultar-jogadores', _id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() data: UpdateJogadoreDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    if (data.categoria) {
      const categoria$ = this.clientAdminBackend.send(
        'consultar-categorias',
        data.categoria,
      );
      const categoria = await lastValueFrom(categoria$);

      if (categoria) {
        this.clientAdminBackend.emit('atualizar-jogador', {
          id: _id,
          jogador: data,
        });
      } else {
        throw new BadRequestException(`Categoria não cadastrada!`);
      }
    } else {
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: data,
      });
    }
  }

  @Get()
  find(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Delete('/:_id')
  async delete(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', { _id });
  }
}
