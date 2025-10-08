import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Direction } from './schema/direction.schema';
import { ClientSession, Model } from 'mongoose';
import { Directeur } from './schema/directeur.schema';
import { Admin } from 'src/admins/schema/admin.schema';
import { DirecteurDto } from './dto/create-directeur.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
@Injectable()
export class DirectionsService {
  private readonly logger = new Logger(DirectionsService.name)
  constructor(
    @InjectModel(Direction.name) private DirectionModel : Model<Direction>,
    @InjectModel(Directeur.name) private DirecteurModel : Model<Directeur>,
    @InjectModel(Admin.name) private AdminModel : Model<Admin>
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
    const directionExists = await this.DirectionModel.findOne({nom : direction})
    if(!directionExists) throw new BadRequestException('Direction not found')
    const adminExists = await this.AdminModel.findOne({matricule : matricule})
    if(!adminExists) throw new BadRequestException('Admin not found')
    if(adminExists.role !== 'dir') throw new BadRequestException('Admin role must be directeur')
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
      const result = await this.DirectionModel.aggregate([
        // First lookup: Join with Admin collection
        {
          $lookup: {
            from: 'directeurs',           // Make sure this matches your MongoDB collection name
            localField: 'nom',  // Field in Directeur collection
            foreignField: 'direction', // Field in Admin collection
            as: 'directeurs'
          }
        },
        { $unwind: { path: "$directeurs", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "admins",
            localField: "directeurs.matricule",
            foreignField: "matricule",
            as: "admin"
          }
        },
        { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$nom",
            admins: {
              $push: {
                matricule: "$admin.matricule",
                nom: "$admin.nom",
                prenom: "$admin.prenom"
              }
            },
            count: { $sum: { $cond: [{ $ifNull: ["$admin.matricule", false] }, 1, 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            nom: "$_id",
            count: 1,
            admins: 1
          }
        },
        { $sort: { nom: 1 } } // optional
      ]).exec();

      return result;
    } catch (error) {
      this.logger.error('Failed to group admins by direction', error);
      throw new BadRequestException('Failed to retrieve grouped data');
    }
  }

  async getAllDirecteurs() {
    return await this.DirecteurModel.aggregate([
      {
        $lookup: {
          from: "admins",           
          localField: "matricule", 
          foreignField: "matricule", 
          as: "adminData"
        }
      },
      { $unwind: "$adminData" },
      {
          $project: {
            _id: 0,
            matricule: 1,
            departement: 1,
            nom: "$adminData.nom",
            prenom: "$adminData.prenom"
          }
        },
    ]);
  }
}
