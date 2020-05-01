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

    constructor(private universe: UniverseService, private market: MarketsService) {

    }

    getTable(): Promise<object> {

        if (this.table.config.cacheDate > Date.now()) {
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
                if (roid) {
                    roid.average_price = entry.average_price;
                    roid.adjusted_price = entry.adjusted_price;
                }

                let mineral = this.mineralList.find((item) => item.type_id == entry.type_id);
                if (mineral) {
                    mineral.average_price = entry.average_price;
                    mineral.adjusted_price = entry.adjusted_price;
                }
            })

            this.table.headers.push(
                { name: "", url: "" },
                { name: "Ore Price", url: "" }
            )

            this.mineralList.forEach((mineral) => {
                this.table.headers.push({ name: mineral.name, url: "", meta: mineral });
            })

            //spacer for refined/ore.. if we keep that?
            this.table.headers.push({ name: "", url: "" })

            this.table.headers.push({ name: "Volume", url: "" })
            this.table.headers.push({ name: "isk/m3", url: "" })
            this.table.headers.push({ name: "isk/hour", url: "" })

            //put roids in our rows... padding columns where needed. 

            this.roidList.forEach((roid) => {
                //build row
                let row = [roid, roid.average_price + 'isk']

                this.mineralList.forEach((mineral) => {
                    let roidMineral = roid.minerals.find((min) => mineral.type_id == min.type_id);
                    if (mineral.average_price && roidMineral && roidMineral.type_id) {
                        row.push((mineral.average_price * roidMineral.quantity).toFixed(2) + 'isk')
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


    getRoidList(): Promise<Array<RoidData>> {
        if (this.roidList.length > 0) {
            return new Promise((resolve, reject) => {
                resolve(this.roidList);
            });
        }

        const roidIDs = [22, 1223, 1225, 1232, 1229, 21, 1231, 1226, 20, 11396, 1227, 18, 1224, 1228, 19, 1230];

        let httpRequests = [];
        roidIDs.forEach((id) => {
            httpRequests.push(this.universe.getTypeInformation(id));
        })

        return Promise.all(httpRequests).then((results) => {
            results.forEach((httpResult) => {

                var roidData = <RoidData>httpResult.data;
                roidData.minerals = [];

                if (roidData.name == 'Veldspar') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 415
                    });
                }

                if (roidData.name == 'Scordite') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 346
                    });

                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 173
                    })
                }

                if (roidData.name == 'Pyroxers') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 351
                    });
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 25
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 50
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 5
                    });
                }

                if (roidData.name == 'Plagioclase') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 107
                    });
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 213
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 107
                    });
                }

                if (roidData.name == 'Omber') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 800
                    });
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 100
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 85
                    });
                }

                if (roidData.name == 'Kernite') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 134
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 267
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 134
                    });
                }

                if (roidData.name == 'Jaspet') {
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 350
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 75
                    });
                    //Zydrine
                    roidData.minerals.push({
                        type_id: 39,
                        quantity: 8
                    });
                }

                if (roidData.name == 'Hemorphite') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 2200
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 100
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 120
                    });
                    //Zydrine
                    roidData.minerals.push({
                        type_id: 39,
                        quantity: 15
                    });
                }

                if (roidData.name == 'Hedbergite') {
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 1000
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 200
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 100
                    });
                    //Zydrine
                    roidData.minerals.push({
                        type_id: 39,
                        quantity: 19
                    });
                }


                if (roidData.name == 'Gneiss') {
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 2200
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 2400
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 300
                    });
                }

                if (roidData.name == 'Dark Ochre') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 10000
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 1600
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 120
                    });
                }

                if (roidData.name == 'Crokite') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 21000
                    });
                    //Nocxium
                    roidData.minerals.push({
                        type_id: 38,
                        quantity: 760
                    });
                    //Zydrine
                    roidData.minerals.push({
                        type_id: 39,
                        quantity: 135
                    });
                }

                if (roidData.name == 'Spodumain') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 56000
                    });
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 12050
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 2100
                    });
                    //Isogen
                    roidData.minerals.push({
                        type_id: 37,
                        quantity: 450
                    });
                }

                if (roidData.name == 'Bistot') {
                    //Pyerite
                    roidData.minerals.push({
                        type_id: 35,
                        quantity: 12000
                    });
                    //Zydrine
                    roidData.minerals.push({
                        type_id: 39,
                        quantity: 450
                    });

                    //Megacyte
                    roidData.minerals.push({
                        type_id: 40,
                        quantity: 100
                    });
                }

                if (roidData.name == 'Arkonor') {
                    //tritanium
                    roidData.minerals.push({
                        type_id: 34,
                        quantity: 22000
                    });
                    //Mexallon
                    roidData.minerals.push({
                        type_id: 36,
                        quantity: 2500
                    });
                    //Megacyte
                    roidData.minerals.push({
                        type_id: 40,
                        quantity: 320
                    });
                }

                if(roidData.name == 'Mercoxit'){
                    //morphite
                    roidData.minerals.push({
                        type_id: 11399,
                        quantity: 300
                    });
                }

                this.roidList.push(httpResult.data);
            })

            return this.roidList;
        })
    }

    getMineralList(): Promise<Array<MineralData>> {
        if (this.mineralList.length > 0) {
            return new Promise((resolve, reject) => {
                resolve(this.mineralList);
            });
        }

        const mineralIDs = [34, 35, 36, 37, 38, 39, 40, 11399];
        let httpRequests = [];

        mineralIDs.forEach((id) => {
            httpRequests.push(this.universe.getTypeInformation(id));
        })
        return Promise.all(httpRequests).then((results) => {
            results.forEach((httpResult) => {
                this.mineralList.push(httpResult.data);
            })

            return this.mineralList;
        })
    }
}

declare interface TableHeader {
    name: string;
    url: string;
    meta?: object;
}

export interface RoidData {
    type_id: number;
    name: string;
    description: string;
    volume: number;
    average_price?: number;
    adjusted_price?: number;
    minerals: Array<RoidMineral>;
}

export interface MineralData {
    type_id: number;
    name: string;
    description: string;
    volume: number;
    average_price?: number;
    adjusted_price?: number;
    refinery: Array<object>;
}

declare interface RoidMineral {
    type_id: number;
    quantity: number;
}