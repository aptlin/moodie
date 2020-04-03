import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import {
  CreateDTO,
  CreateResponseDTO,
  UpdateExperienceDTO,
  UpdateExperienceResponseDTO,
  DeleteExperienceDTO,
  DeleteExperienceResponseDTO,
  DeleteThemeDTO,
  DeleteThemeResponseDTO,
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

  async _updateOrCreateExperience(
    userId: string,
    experience: string | string[],
    options: {
      themeDocument?: Theme & Document;
      isFavorite: boolean;
      upsert: boolean;
      name?: string | string[];
    },
  ) {
    const { themeDocument, isFavorite, upsert, name: names } = options;
    if (
      names &&
      ((Array.isArray(names) && !Array.isArray(experience)) ||
        (!Array.isArray(names) && Array.isArray(experience)) ||
        (Array.isArray(names) &&
          Array.isArray(experience) &&
          names.length !== experience.length))
    ) {
      throw new BadRequestException(
        'New names much match the length of the query.',
      );
    }
    const bulk = this.experienceModel.collection.initializeUnorderedBulkOp();
    if (Array.isArray(experience)) {
      for (const [index, name] of experience.entries()) {
        let res = bulk.find({ userId, name });
        if (upsert) {
          res = res.upsert();
        }
        if (names) {
          res.update({ $set: { isFavorite, name: names[index] } });
        } else {
          res.update({ $set: { isFavorite } });
        }
      }
    } else {
      let res = bulk.find({ userId, name: experience });
      if (upsert) {
        res = res.upsert();
      }
      if (names) {
        res.update({ $set: { isFavorite, name: names } });
      } else {
        res.update({ $set: { isFavorite } });
      }
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
    const { total, updated, created } = await this._updateOrCreateExperience(
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
    updateExperienceDTO: UpdateExperienceDTO,
  ): Promise<UpdateExperienceResponseDTO> {
    const { experience, isFavorite, name } = updateExperienceDTO;
    const { total, updated } = await this._updateOrCreateExperience(
      userId,
      experience,
      {
        upsert: false,
        isFavorite,
        name,
      },
    );
    return { total, updated };
  }

  async deleteExperience(
    userId: string,
    deleteExperienceDTO: DeleteExperienceDTO,
  ): Promise<DeleteExperienceResponseDTO> {
    const { experience } = deleteExperienceDTO;
    const experienceEntries = await this.experienceModel.find({
      userId,
      name: { $in: Array.isArray(experience) ? experience : [experience] },
    });
    const experienceIds = experienceEntries.map(entry => entry.id);
    await this.themeModel.updateMany(
      {
        userId,
        experiences: { $in: experienceIds },
      },
      { $pullAll: { experiences: experienceIds } },
    );
    const { ok, deletedCount } = await this.experienceModel.deleteMany({
      _id: { $in: experienceIds },
    });

    return { message: ok ? 'ok' : 'error', deletedCount };
  }

  async deleteTheme(
    userId: string,
    deleteThemeDTO: DeleteThemeDTO,
  ): Promise<DeleteThemeResponseDTO> {
    const { theme } = deleteThemeDTO;
    const themeDocuments = await this.themeModel.find({
      userId,
      name: { $in: Array.isArray(theme) ? theme : [theme] },
    });
    const themeIds = themeDocuments.map(doc => doc.id);
    await this.moodModel.updateMany(
      {
        userId,
        themes: { $in: themeIds },
      },
      { $pullAll: { themes: themeIds } },
    );
    const { ok, deletedCount } = await this.themeModel.deleteMany({
      _id: { $in: themeIds },
    });

    return { message: ok ? 'ok' : 'error', deletedCount };
  }
}
