import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadorService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadorService.name);

  async createJogador(jogador: Jogador): Promise<Jogador> {
    const { email } = jogador;
    const jogadorFond = await this.jogadorModel.findOne({ email });

    if (jogadorFond) {
      throw new RpcException(`Email ${email} já esta sendo utilizado`);
    }

    this.logger.log(`createJogador: ${JSON.stringify(jogador, null, 2)}`);
    const jogadorCreated = new this.jogadorModel(jogador);
    return jogadorCreated.save();
  }

  async updateJogador(_id: string, data: Jogador): Promise<void> {
    const findedJogador = await this.jogadorModel.findById(_id);

    if (!findedJogador) {
      throw new RpcException(`Não existe um jogador com o id ${_id}`);
    }

    this.logger.log(`updateJogador: ${JSON.stringify(data, null, 2)}`);

    await this.jogadorModel.findOneAndUpdate(
      {
        _id,
      },
      { $set: data },
    );
  }

  async findAllJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().populate('categoria').exec();
  }

  async findJogadorBy_id(_id: string): Promise<Jogador> {
    const findedJogador = await this.jogadorModel
      .findById(_id)
      .populate('categoria')
      .exec();

    if (!findedJogador) {
      throw new RpcException(`Jogador com o id ${_id} não encontrado`);
    }

    return findedJogador;
  }

  async deleteJogador(_id: string): Promise<Jogador> {
    return await this.jogadorModel.findOneAndDelete({ _id });
  }
}
