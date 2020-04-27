import { Controller, Get } from '@nestjs/common';
import { OreTableService, RoidData } from './ore-table.service';

@Controller('/api/ore-table')
export class OreTableController {

    constructor(
        private oreTable:OreTableService
    ){}

    @Get()
    getOreTable():Promise<object>{
        
        return this.oreTable.getTable();
    }

    @Get('/testing')
    testing():Promise<Array<RoidData>>{
        return this.oreTable.getMineralList();
    }
}
