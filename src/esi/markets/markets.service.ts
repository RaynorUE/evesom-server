import { Injectable } from '@nestjs/common';
import { EsiConfigService } from '../esiconfig.service';
import { HttpService } from '@nestjs/common';

@Injectable()
export class MarketsService {

    private marketPrices = {
        data: <Array<MarketPrices>>[],
        cacheDate: Date.now()
    }

    constructor(private esiConfig: EsiConfigService, private http:HttpService){
       
    }

    listMarketPrices():Promise<Array<MarketPrices>>{

        if(this.marketPrices.cacheDate > Date.now()){
            return new Promise((resolve, reject) =>{
                resolve(this.marketPrices.data);
            })
        }

        this.esiConfig.setVersion('v1');

        const apiPath = '/markets/prices';

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


