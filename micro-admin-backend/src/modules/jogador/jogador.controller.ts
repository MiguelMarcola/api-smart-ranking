import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadorService } from './jogador.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class JogadorController {
  constructor(private readonly jogadorService: JogadorService) {}

  logger = new Logger(JogadorController.name);

  @EventPattern('criar-jogador')
  async create(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
      await this.jogadorService.createJogador(jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async find(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.jogadorService.findJogadorBy_id(_id);
      } else {
        return await this.jogadorService.findAllJogadores();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-jogador')
  async update(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadorService.updateJogador(_id, jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('deletar-jogador')
  async remove(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`_id = ${_id}`);
      await this.jogadorService.deleteJogador(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error = ${error.message}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
