import { Test, TestingModule } from '@nestjs/testing';
import { OreTableController } from './ore-table.controller';

describe('OreTable Controller', () => {
  let controller: OreTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OreTableController],
    }).compile();

    controller = module.get<OreTableController>(OreTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
