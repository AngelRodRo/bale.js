'use strict';
let DBW = require('./dbw');

class Bale{
    constructor(){
        this.names = []; 
        this.relations = [];
        this.seeds = [];
        this.name = "";
        this.dbw = "";
        this.generators = []
        
        this.use = this.use.bind(this);
        this.seed = this.seed.bind(this);
        this.genSeed = this.genSeed.bind(this);
        this.exports = this.exports.bind(this);
        
        this.dfPK = "_id";
    }

    connect(opts){
        let dbw = new DBW(opts); 
        return dbw.connect().then((dbw)=>{ 
            this.dbw = dbw;
            return this; 
        });      
    }

    use(seeder){
        let exports = seeder;
        
        this.relations.push(exports.relation)
        this.seeds.push(seeder.seeds);
        this.names.push(exports.name);
    }


    seed(){
        
        return new Promise((resolve,reject)=>{

            let self = this;
            function runGenerator(generator) {

                generator.then((values)=>{
                    it.next(values)
                });
            }
    
            function *main (){
                let generatedSeeds = {};
                
                for (var i = 0; i < self.seeds.length; i++) {
                
                    let generator = [];
                    if(self.relations[i]){
                        let ids = generatedSeeds[self.relations[i]];
                        
                        for (var j = 0; j < self.seeds[i].length; j++) {
                            let randIndex = Math.floor((Math.random()*(ids.length-1)) + 0);
                            self.seeds[i][j][self.relations[i]+"Id"] = ids[randIndex];
                            generator.push(self.createGenerator(self.names[i],self.seeds[i][j]))                                
                        }
    
                    }else{
                        for (var j = 0; j < self.seeds[i].length; j++) {
                            generator.push(self.createGenerator(self.names[i],self.seeds[i][j]))                                
                        }
                    }
                    generatedSeeds[self.names[i]] = yield runGenerator(Promise.all(generator));
                }

                resolve();
            }
    
            var it = main();
            it.next(); 
        });
        
    }

    genSeed(name,count,document,...opts){
        
        let [relation] = opts;


        for (let i = 0; i < count; i++) {
            let obj = document({});
            this.seeds.push(obj);
        }
        return {
            name: name,
            seeds : this.seeds,
            relation: relation
        }
    }

    createGenerator(name,obj){
        return this.dbw.resource(name).insert(obj).then((result)=>result.insertedIds[0]).catch(e=>{console.log(e)});
    }

    exports (){
        return {
            name: this.name,
            seeds : this.seeds
        }
    }
}


module.exports = Bale;