import { Test, TestingModule } from '@nestjs/testing';
import { MoodService } from './mood.service';

describe('MoodService', () => {
  let service: MoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodService],
    }).compile();

    service = module.get<MoodService>(MoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
