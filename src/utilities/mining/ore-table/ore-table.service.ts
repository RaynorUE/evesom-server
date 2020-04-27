import { Injectable } from '@nestjs/common';
import { UniverseService } from '../../../esi/universe/universe.service';
import { MarketsService } from '../../../esi/markets/markets.service';

@Injectable()
export class OreTableService {

    table = {
        config: {
            cacheDate: 0
        },
        headers: <Array<TableHeader>>[],
        rows: []
    }

    roidList = <Array<RoidData>>[];
    mineralList = <Array<MineralData>>[];

    constructor(private universe:UniverseService, private market:MarketsService){

    }

    getTable():Promise<object>{

        if(this.table.config.cacheDate > Date.now()){
            return new Promise((resolve, reject) => {
                resolve(this.table);
            })
        }


        this.table.config.cacheDate = Date.now();

        return Promise.all([this.getRoidList(), this.getMineralList(), this.market.listMarketPrices()]).then((results) => {
            
            this.table.headers = [];
            this.table.rows = [];
            

            let marketPrices = results[2];
            //add market prices into lists
            marketPrices.forEach((entry) => {
                let roid = this.roidList.find((item) => item.type_id == entry.type_id);
                if(roid){
                    roid.average_price = entry.average_price;
                    roid.adjusted_price = entry.adjusted_price;
                }

                let mineral = this.mineralList.find((item) => item.type_id == entry.type_id);
                if(mineral){
                    mineral.average_price = entry.average_price;
                    mineral.adjusted_price = entry.adjusted_price;
                }
            })
            
            this.table.headers.push(
                {name:"", url:"" },
                {name:"Price", url:"" }
                )
            
            this.mineralList.forEach((mineral) =>{
                this.table.headers.push({name:mineral.name, url:"", meta:mineral});
            })

            //spacer for refined/ore.. if we keep that?
            this.table.headers.push({name:"", url:""})

            this.table.headers.push({name:"Volume", url:""})
            this.table.headers.push({name:"isk/m3", url:""})
            this.table.headers.push({name:"isk/hour", url:""})

            //put roids in our rows... padding columns where needed. 

            this.roidList.forEach((roid) =>{
                //build row
                let row = [roid, roid.average_price + 'isk']

                this.mineralList.forEach((mineral) => {
                    if(mineral.average_price){
                        row.push(mineral.average_price + 'isk')
                    } else {
                        row.push('0');
                    }
                })

                //padd remaining with placeholders..
                row.push('refined/ore')
                row.push('0')
                row.push('0')
                row.push('0')

                this.table.rows.push(row);
            })

            this.table.config.cacheDate = Date.now() + (1000 * 60 * 60 * 24);

            return this.table;
        })

    }


    getRoidList():Promise<Array<RoidData>>{
        if(this.roidList.length > 0){
            return new Promise((resolve, reject) =>{
                resolve(this.roidList);
            });
        }

        const roidIDs = [22,1223,1225,1232,1229,21,1231,1226,20,11396,1227,18,1224,1228,19,1230];

        let httpRequests = [];
        roidIDs.forEach((id) => {
            httpRequests.push(this.universe.getTypeInformation(id));
        })

        return Promise.all(httpRequests).then((results) =>{
            results.forEach((httpResult) =>{
                this.roidList.push(httpResult.data);
            })
            
            return this.roidList;
        })
    }

    getMineralList():Promise<Array<MineralData>>{
        if(this.mineralList.length > 0){
            return new Promise((resolve, reject) =>{
                resolve(this.mineralList);
            });
        }
        
        const mineralIDs = [34,35,36,37,38,39,40,11399];
        let httpRequests = [];

        mineralIDs.forEach((id) => {
            httpRequests.push(this.universe.getTypeInformation(id));
        })
        return Promise.all(httpRequests).then((results) =>{
            results.forEach((httpResult) =>{
                this.mineralList.push(httpResult.data);
            })
            
            return this.mineralList;
        })    }
}

declare interface TableHeader {
    name:string;
    url:string;
    meta?:object;
}

export interface RoidData {
    type_id:number;
    name:string;
    description:string;
    volume:number;
    average_price?:number;
    adjusted_price?:number;
}

export interface MineralData {
    type_id:number;
    name:string;
    description:string;
    volume:number;
    average_price?:number;
    adjusted_price?:number;
}