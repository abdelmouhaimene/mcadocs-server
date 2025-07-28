import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demande } from './schema/demandes.schama';
import { createReadStream,createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { join } from 'path';

const pump = promisify(pipeline);
import { Multer } from 'multer';

@Injectable()
export class DemandesService {
    constructor(
      @InjectModel(Demande.name) private DemandeModel : Model<Demande>,
    ) {}

    async uploadDocumentToDisk(
      documentName: string,
      matricule : string,
      file: Express.Multer.File,
      uploadPath: string,
    ): Promise<Demande> {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadPath, fileName);

      // Save file to disk
      await pump(file.stream, createWriteStream(filePath));

      const newDocument = new this.DemandeModel({
        nom: documentName,
        matricule : matricule,
        filePath: filePath,
        mimetype: file.mimetype,
        size: file.size,
      });

      return newDocument.save();
    }

  // create(createDemandeDto: CreateDemandeDto) {
  //   return 'This action adds a new demande';
  // }

  // findAll() {
  //   return `This action returns all demandes`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} demande`;
  // }

  // update(id: number, updateDemandeDto: UpdateDemandeDto) {
  //   return `This action updates a #${id} demande`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} demande`;
  // }
}
