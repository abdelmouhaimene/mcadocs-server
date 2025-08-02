import { Injectable } from '@nestjs/common';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Doc } from './schema/docs.schema';
import { Model } from 'mongoose';
import { Directeur } from 'src/directions/schema/directeur.schema';
import { Direction } from 'src/directions/schema/direction.schema';

@Injectable()
export class DocsService {
  constructor(
    @InjectModel(Doc.name) private docModel: Model<Doc>,
    @InjectModel(Directeur.name) private directeurModel: Model<Directeur>,
    @InjectModel(Direction.name) private directionModel: Model<Direction>
  ) {}
  async create(createDocDto: CreateDocDto) {
    return await this.docModel.create(createDocDto);
  }

  async findAll() {
    return await this.docModel.find().populate('direction').populate('directeur').exec();
  }

  async findOne(nom: number) {
    return await this.docModel.findOne({ nom }).populate('direction').populate('directeur').exec();
  }

  async findAllByDirection(direction: string) {
    return await this.docModel.find({ direction }).populate('direction').populate('directeur').exec();
  }

  async findAllByDirecteur(matricule: string) {
    const directeur = await this.directeurModel.findOne({ matricule }).exec();
    if (!directeur) { 
      throw new Error(`Directeur with matricule ${matricule} not found`);
    } 
    return await this.docModel.find({ directeur: directeur._id }).populate('direction').exec();
  }
}


