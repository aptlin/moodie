import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import {
  CreateDTO,
  CreateResponseDTO,
  UpdateDTO,
  UpdateResponseDTO,
} from './DTO/mood';
import { Experience, Mood, Theme } from './mood.interface';
@Injectable()
export class MoodService {
  private readonly logger = new Logger('Mood Service');
  constructor(
    @InjectModel('Mood')
    private moodModel: Model<Mood & Document>,
    @InjectModel('Theme')
    private themeModel: Model<Theme & Document>,
    @InjectModel('Experience')
    private experienceModel: Model<Experience & Document>,
  ) {}

  async findOrCreateMood(userId: string) {
    const { value: moodDiary } = await this.moodModel.findOneAndUpdate(
      { userId },
      {},
      { new: true, upsert: true, rawResult: true },
      err => {
        if (err) {
          throw new InternalServerErrorException(
            `Could not create the mood diary for user '${userId}'`,
          );
        }
      },
    );
    return moodDiary;
  }

  async findOrCreateTheme(
    userId: string,
    moodDiary: Mood & Document,
    name: string,
  ) {
    const {
      value: themeDocument,
      // lastErrorObject,
    } = await this.themeModel.findOneAndUpdate(
      { userId, name: name },
      {},
      { new: true, upsert: true, rawResult: true },
      err => {
        if (err) {
          throw new InternalServerErrorException(
            `Could not create a theme '${name}' for user '${userId}'`,
          );
        }
      },
    );

    // TODO: check using lastErrorObject when the mongoose bug is fixed
    if (!moodDiary.themes.includes(themeDocument.id)) {
      this.logger.verbose(`Created a theme '${name}' for user '${userId}'.`);
      moodDiary.themes.push(themeDocument.id);
    }
    return themeDocument;
  }

  async updateOrCreateExperience(
    userId: string,
    experience: string | string[],
    options: {
      themeDocument?: Theme & Document;
      isFavorite: boolean;
      upsert: boolean;
    },
  ) {
    const { themeDocument, isFavorite, upsert } = options;
    const bulk = this.experienceModel.collection.initializeUnorderedBulkOp();
    if (Array.isArray(experience)) {
      for (const name of experience) {
        let res = bulk.find({ userId, name });
        if (upsert) {
          res = res.upsert();
        }
        res.update({ $set: { isFavorite } });
      }
    } else {
      let res = bulk.find({ userId, name: experience });
      if (upsert) {
        res = res.upsert();
      }
      res.update({ $set: { isFavorite } });
    }
    const results = await bulk.execute();
    if (results.hasWriteErrors()) {
      throw new InternalServerErrorException(results.getWriteErrors());
    }
    const upsertedIds = results.getUpsertedIds();

    for (const result of upsertedIds) {
      const { _id, index } = result;
      themeDocument.experiences.push(_id);
      this.logger.verbose(
        `Created a ${isFavorite ? 'favorite' : 'disliked'} experience '${
          Array.isArray(experience) ? experience[index] : experience
        }' themed as '${themeDocument.name}' for user '${userId}'`,
      );
    }
    const nTargetChanges = Array.isArray(experience) ? experience.length : 1;
    if (!upsert) {
      return { total: nTargetChanges, updated: results.nModified };
    } else {
      return {
        total: nTargetChanges,
        updated: results.nModified,
        created: upsertedIds.length,
      };
    }
  }
  async createExperience(
    userId: string,
    createDTO: CreateDTO,
  ): Promise<CreateResponseDTO> {
    const { theme, experience, isFavorite } = createDTO;
    const moodDiary = await this.findOrCreateMood(userId);
    const themeDocument = await this.findOrCreateTheme(
      userId,
      moodDiary,
      theme,
    );
    const { total, updated, created } = await this.updateOrCreateExperience(
      userId,
      experience,
      {
        themeDocument,
        isFavorite,
        upsert: true,
      },
    );

    await themeDocument.save();
    await moodDiary.save();

    return { total, updated, created };
  }
  async updateExperience(
    userId: string,
    updateDTO: UpdateDTO,
  ): Promise<UpdateResponseDTO> {
    const { experience, isFavorite } = updateDTO;
    const { total, updated } = await this.updateOrCreateExperience(
      userId,
      experience,
      {
        upsert: false,
        isFavorite,
      },
    );
    return { total, updated };
  }
}
