import { Test, TestingModule } from '@nestjs/testing';
import { OreTableService } from './ore-table.service';

describe('OreTableService', () => {
  let service: OreTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OreTableService],
    }).compile();

    service = module.get<OreTableService>(OreTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
