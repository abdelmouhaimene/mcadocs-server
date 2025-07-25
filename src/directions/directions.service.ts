import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Direction } from './schema/direction.schema';
import { ClientSession, Model } from 'mongoose';
import { Directeur } from './schema/directeur.schema';
import { DirecteurDto } from './dto/create-directeur.dto';
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

  async update(nom: string) {
    // Validate input
    if (!nom || nom === '') {
      throw new BadRequestException('nom is required');
    }

    // Find and update the direction
    const updatedDirection = await this.DirectionModel.findOneAndUpdate(
      { nom: nom }, // Find by current name
      { nom: nom }, // Update with new name (same in this case, but you might want different logic)
      { 
        new: true,     // Return the updated document
        upsert: false  // Don't create if doesn't exist
      }
    );

    // Check if direction was found and updated
    if (!updatedDirection) {
      throw new BadRequestException(`Direction with name "${nom}" not found`);
    }

    return updatedDirection;
  }

  async remove(nom: string) {
    if (!nom || nom === '') {
      throw new BadRequestException('Direction name is required');
    }

    let session: ClientSession | null = null;
    try {
      session = await this.DirectionModel.db.startSession();
      session.startTransaction();

      const [directeurResult, directionResult] = await Promise.all([
        this.DirecteurModel.deleteMany({ direction: nom }).session(session),
        this.DirectionModel.deleteOne({ nom: nom }).session(session),
      ]);

      await session.commitTransaction();

      return {
        deletedDirections: directionResult.deletedCount,
        deletedDirecteurs: directeurResult.deletedCount
      };
    } catch (error: unknown) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          this.logger.error('Failed to abort transaction', abortError);
        }
      }

      if (error instanceof Error) {
        throw new BadRequestException(`Failed to delete direction and associated directeurs: ${error.message}`);
      } else {
        throw new BadRequestException('Failed to delete direction and associated directeurs due to an unknown error');
      }
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (endSessionError) {
          this.logger.error('Failed to end session', endSessionError);
        }
      }
    }
  }

  async setDirecteur(directeurDto : DirecteurDto){
    const {matricule,direction} = directeurDto
    if (!direction || !matricule) throw new BadRequestException('Direction et directeur is required');
    const isDirecteurInUse = await this.DirecteurModel.find({matricule : matricule})
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

}
