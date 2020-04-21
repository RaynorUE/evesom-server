import { Injectable } from '@nestjs/common';
import { ESIConfig } from '../esiconfig';
import { HttpService } from '@nestjs/common';

@Injectable()
export class MarketsService {

    private marketPrices = {
        data: <Array<marketPrices>>[],
        cacheDate: Date.now()
    }

    constructor(private esiConfig: ESIConfig, private http:HttpService){
     
        this.esiConfig.setVersion('v1');
    }

    listMarketPrices():Promise<Array<marketPrices>>{
        const apiPath = '/markets/prices';

        if(this.marketPrices.cacheDate > Date.now()){
            return new Promise((resolve, reject) =>{
                resolve(this.marketPrices.data);
            })
        }
        
        var endpoint = this.esiConfig.buildUrl(apiPath);

        return this.http.get(endpoint).toPromise().then((response) =>{
            this.marketPrices.cacheDate = this.getNewCacheTime();
            this.marketPrices.data = response.data;
            return response.data
        });

    }


    private getNewCacheTime():number {
        return Date.now() + (1000 * 60 * 60 * 24); //refresh daily
    }


    public resetCache(cacheName:string):void {
        if(cacheName){
            this[cacheName].cacheDate = Date.now();
        }
    }

}


