import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Direction } from './schema/direction.schema';
import { ClientSession, Model } from 'mongoose';
import { Directeur } from './schema/directeur.schema';
import { DirecteurDto } from './dto/create-directeur.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
@Injectable()
export class DirectionsService {
  private readonly logger = new Logger(DirectionsService.name)
  constructor(
    @InjectModel(Direction.name) private DirectionModel : Model<Direction>,
    @InjectModel(Directeur.name) private DirecteurModel : Model<Directeur>
  ) {}

  async create(createDirectionDto: CreateDirectionDto) {
    const {nom} = createDirectionDto;
    const nomInUse = await this.DirectionModel.findOne({nom : nom})
    if(nomInUse) throw new ConflictException('nom already in use')
    return await this.DirectionModel.create({nom})
  }

  async findAll() {
    return await this.DirectionModel.find();
  }

  async findOne(nom: string)  {
    if(!nom || nom === '') throw new BadRequestException('nom is required');
    return await this.DirectionModel.findOne({nom : nom});
  }

  async update(nom: string, updateDirectionDto: UpdateDirectionDto) {
    const {newNom} = updateDirectionDto;

    if (!nom || nom === '' || !newNom || newNom === '') {
      throw new BadRequestException('nom is required');
    }

    const updatedDirection = await this.DirectionModel.findOneAndUpdate(
      { nom: nom }, 
      { nom: newNom }, 
      { 
        new: true,   
        upsert: false  
      }
    );

    if (!updatedDirection) {
      throw new BadRequestException(`Direction with name "${nom}" not found`);
    }
    return updatedDirection;
  }

  async remove(nom: string) {
    // if (!nom || nom === '') {
    //   throw new BadRequestException('Direction name is required');
    // }

    // let session: ClientSession | null = null;
    // try {
    //   session = await this.DirectionModel.db.startSession();
    //   session.startTransaction();

    //   const [directeurResult, directionResult] = await Promise.all([
    //     this.DirecteurModel.deleteMany({ direction: nom }).session(session),
    //     this.DirectionModel.deleteOne({ nom: nom }).session(session),
    //   ]);

    //   await session.commitTransaction();

    //   return {
    //     deletedDirections: directionResult.deletedCount,
    //     deletedDirecteurs: directeurResult.deletedCount
    //   };
    // } catch (error: unknown) {
    //   if (session) {
    //     try {
    //       await session.abortTransaction();
    //     } catch (abortError) {
    //       this.logger.error('Failed to abort transaction', abortError);
    //     }
    //   }

    //   if (error instanceof Error) {
    //     throw new BadRequestException(`Failed to delete direction and associated directeurs: ${error.message}`);
    //   } else {
    //     throw new BadRequestException('Failed to delete direction and associated directeurs due to an unknown error');
    //   }
    // } finally {
    //   if (session) {
    //     try {
    //       await session.endSession();
    //     } catch (endSessionError) {
    //       this.logger.error('Failed to end session', endSessionError);
    //     }
    //   }
    // }
    if (!nom || nom === '') {
      throw new BadRequestException('Direction name is required');
    }

    try {
      const [directeurResult, directionResult] = await Promise.all([
        this.DirecteurModel.deleteMany({ direction: nom }).exec(),
        this.DirectionModel.deleteOne({ nom: nom }).exec(),
    ]);

    return {
      deletedDirections: directionResult.deletedCount,
      deletedDirecteurs: directeurResult.deletedCount
    };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to delete: ${error.message}`);
      }
      throw new BadRequestException('Failed to delete due to unknown error');
    }
  }

  async setDirecteur(directeurDto : DirecteurDto){
    const {matricule,direction} = directeurDto
    if (!direction || !matricule) throw new BadRequestException('Direction et directeur is required');
    const isDirecteurInUse = await this.DirecteurModel.findOne({matricule : matricule})
    if(isDirecteurInUse) throw new ConflictException('directeur already in use')
    return await this.DirecteurModel.create({
      matricule,
      direction 
    })
  }

  async deleteDirecteur(matricule : string){
    if (!matricule ) throw new BadRequestException('Direction et directeur is required');
    return await this.DirecteurModel.deleteOne({ matricule : matricule })
  }

async getAdminsGroupedByDirection() {
  try {
    const result = await this.DirecteurModel.aggregate([
      // First lookup: Join with Admin collection
      {
        $lookup: {
          from: 'admins',           // Make sure this matches your MongoDB collection name
          localField: 'matricule',  // Field in Directeur collection
          foreignField: 'matricule', // Field in Admin collection
          as: 'adminData'
        }
      },
      // Filter out documents without matching admin
      {
        $match: {
          'adminData.0': { $exists: true } // Only keep Directeurs with matching Admin
        }
      },
      // Unwind the admin array
      { $unwind: '$adminData' },
      // Group by direction
      {
        $group: {
          _id: '$direction',  // Group by the direction field
          directionName: { $first: '$direction' },
          admins: {
            $push: {
              matricule: '$adminData.matricule',
              nom: '$adminData.nom',
              prenom: '$adminData.prenom'
            }
          },
          count: { $sum: 1 } // Optional: count of admins per direction
        }
      },
      // Project to clean up output
      {
        $project: {
          _id: 0,
          direction: '$directionName',
          admins: 1,
          count: 1 // Optional
        }
      },
      // Sort by direction name (optional)
      { $sort: { direction: 1 } }
    ]).exec();

    return result;
  } catch (error) {
    this.logger.error('Failed to group admins by direction', error);
    throw new BadRequestException('Failed to retrieve grouped data');
  }
}

}
