import { Injectable } from '@nestjs/common';
import { UniverseService } from '../../../esi/universe/universe.service'

@Injectable()
export class OreTableService {

    table = {
        config: {
            cacheDate: Date.now()
        },
        columns:[],
        rows:[]
    }

    roidList = <Array<RoidData>>[];
    mineralList = <Array<MineralData>>[];

    constructor(private universe:UniverseService){

    }

    build():void{


        this.table.config.cacheDate = Date.now();
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


export interface RoidData {
    type_id:number;
    name:string;
    description:string;
    volume:number;
}

export interface MineralData {
    type_id:number;
    name:string;
    description:string;
    volume:number;
}