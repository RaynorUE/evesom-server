import { Injectable } from '@nestjs/common';
import { EsiConfigService } from '../esiconfig.service';
import { HttpService } from '@nestjs/common';


@Injectable()
export class UniverseService {

    constructor(private esiConfig: EsiConfigService, private http:HttpService){
    }

    getTypeInformation(id:number){

        this.esiConfig.setVersion('/v3');
        const apiPath = `/universe/types/${id}`;

        const endpoint = this.esiConfig.buildUrl(apiPath);

        return this.http.get(endpoint).toPromise();
        
    }

}
