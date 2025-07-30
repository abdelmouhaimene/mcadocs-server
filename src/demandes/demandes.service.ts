import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demande } from './schema/demandes.schama';
import { createReadStream,createWriteStream, existsSync, stat } from 'fs';
import { join } from 'path';
import { writeFile } from 'fs/promises';

// const pump = promisify(pipeline);
import { Multer } from 'multer';
import { Directeur } from 'src/directions/schema/directeur.schema';

@Injectable()
export class DemandesService {
  constructor(
    @InjectModel(Demande.name) private DemandeModel : Model<Demande>,
    @InjectModel(Directeur.name) private DirecteurModel : Model<Directeur>
    
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

  async downloadFileByName(nom: string) {
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
        accepte: document.accepte,
        mimetype: document.mimetype,
        size: document.size,
      },
    };
  }
  
  async findAll() {
    return await this.DemandeModel.find().exec();
  }

  async findAllByConsulte( status : boolean) {
    return await this.DemandeModel.find({consulte : status}).exec();
  }

  async findAllByAccepte(status : boolean) {
    return await this.DemandeModel.find({accepte : status}).exec();
  }

  async findAllByMatricule(matricule : string) {
    return await this.DemandeModel.find({ matricule : matricule}).exec();
  }

  async findAllByDirection(direction: string) {
    const directeurs = await this.DirecteurModel.find({ direction: direction }).exec();
    const matricules = directeurs.map(directeur => directeur.matricule);
    return await this.DemandeModel.find({ matricule: { $in: matricules } }).exec();
  }

  async setConsulte(nom: string) {
    const demande = await this.DemandeModel.findOne({ nom }).exec();
    if (!demande) {
      throw new NotFoundException(`Demande with name "${nom}" not found`);
    }
    if (demande.consulte ==  true) {
      throw new BadRequestException(`Demande "${nom}" has already been consulted`);
    } 
    demande.consulte = true;
    return await demande.save();
  }

  async setAccepte(nom: string, status: boolean) {
    const demande = await this.DemandeModel.findOne({ nom }).exec();
    if (!demande) {
      throw new NotFoundException(`Demande with name "${nom}" not found`);
    }
    if ((demande.accepte === status) && (demande.accepte === true)) {
      throw new BadRequestException(`Demande "${nom}" has already been accepted`);
    } 
    if ((demande.accepte === status) && (demande.accepte === false)) {
      throw new BadRequestException(`Demande "${nom}" has already been inaccepted`);
    } 
    demande.accepte = status;
    return await demande.save();
  }


}
