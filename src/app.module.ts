import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OreTableController } from './utilities/mining/ore-table/ore-table.controller';
import { OreTableService } from './utilities/mining/ore-table/ore-table.service';
import { MarketsService } from './esi/markets/markets.service';
import { CoreService } from './esi/core/core.service';
import { HttpModule } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UniverseService } from './esi/universe/universe.service';
import { EsiConfigService } from './esi/esiconfig.service';


@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client')
    })
  ],
  controllers: [AppController, OreTableController],
  providers: [AppService, OreTableService, MarketsService, CoreService, UniverseService, EsiConfigService],
})
export class AppModule {}
