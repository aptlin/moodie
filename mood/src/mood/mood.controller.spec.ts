import { Test, TestingModule } from '@nestjs/testing';
import { MoodController } from './mood.controller';

describe('Mood Controller', () => {
  let controller: MoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodController],
    }).compile();

    controller = module.get<MoodController>(MoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
