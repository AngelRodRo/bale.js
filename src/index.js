"use strict";

class Bale {
    constructor() {
        this.names = []; 
        this.relations = [];
        this.seeders = [];
        this.name = "";
        this.dbw = "";
        this.generators = []
        
        this.use = this.use.bind(this);
        this.seed = this.seed.bind(this);
        this.genSeed = this.genSeed.bind(this);
        this.exports = this.exports.bind(this);
        
        this.dfPK = "_id";

        this.dbDriver = {};
    }

    connect({driver = "mongo", ...connectionArgs}) {
        const DBDriver = require(`./drivers/${driver.toLowerCase()}`);
        this.dbDriver = new DBDriver({driver, ...connectionArgs});
        return this.dbDriver.connect();
    }

    use(seeder) {
        this.seeders.push(seeder);
    }

    async seed() {
        for (const seeder of this.seeders) {
            for (const data of seeder.data) {
                await this.createGenerator(seeder.name, data); 
            }
        }
        console.log("Seeder completed!");
    }

    genSeed(name, count, documentCb) {
        const fakeData = [];

        for (let i = 0; i < count; i++) {
            const obj = documentCb();
            fakeData.push(obj);
        }

        return {
            name,
            data: fakeData
        };
    }

    async createGenerator(modelName, data) {
        const result = await this.dbDriver.insert(modelName, data);
        return result.insertedIds[0];
    }

    exports() {
        return {
            name: this.name,
            seeds : this.seeds
        }
    }
}

module.exports = Bale;