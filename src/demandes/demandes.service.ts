import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demande } from './schema/demandes.schama';
import { createReadStream,createWriteStream, existsSync } from 'fs';
import { join } from 'path';
import { writeFile } from 'fs/promises';

// const pump = promisify(pipeline);
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
    ){      
      // const fileType = await fileTypeFromBuffer (file.buffer);
      if (file?.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed');
      }
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadPath, fileName);

      // Save file to disk
      // await pump(file.stream, createWriteStream(filePath));
      await writeFile(filePath, file.buffer);


      const newDocument = new this.DemandeModel({
        nom: documentName,
        matricule : matricule,
        filePath: filePath,
        mimetype: file.mimetype,
        size: file.size,
      });

      return newDocument.save();
    }

    async getFileByName(nom: string) {
    // 1. Find the document in MongoDB
    const document = await this.DemandeModel.findOne({ nom }).exec();

    if (!document) {
      throw new NotFoundException(`Document with name "${nom}" not found`);
    }

    // 2. Check if the file exists on disk
    if (!existsSync(document.filePath)) {
      throw new NotFoundException(`File not found at path: ${document.filePath}`);
    }

    // 3. Create a readable stream for the file
    const fileStream = createReadStream(document.filePath);

    return {
      fileStream, // Stream to send the file
      metadata: { // Additional metadata
        nom: document.nom,
        matricule: document.matricule,
        mimetype: document.mimetype,
        size: document.size,
      },
    };
  }
  
  findAll() {
     return `This action returns all demandes`;
  }

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
