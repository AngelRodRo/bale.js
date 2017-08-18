'use strict';
let DBW = require('./dbw');

class Bale{
    constructor(){
        this.names = []; 
        this.seeds = [];
        this.name = "";
        this.dbw = "";
        this.generators = []
        
        this.use = this.use.bind(this);
        this.seed = this.seed.bind(this);
        this.genSeed = this.genSeed.bind(this);
        this.exports = this.exports.bind(this);
        
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
        let generator = [];
        for (var i = 0,len = seeder.seeds.length; i < len; i++) {
            generator.push(this.createGenerator(exports.name,seeder.seeds[i]))
        }
    
        this.generators.push(Promise.all(generator));
        this.names.push(exports.name);
    }

    seed(){
        return Promise.all(this.generators).then((values)=>{
            for (var i = 0; i < values.length; i++) {
                let name = this.names[i];
                let objects = values[i];
                console.log('CREATED ' + objects.length + ' OBJECTS FOR ' + name.toUpperCase() + ' RESOURCE');
            }
            return 'okey';
        }).catch(e=>{
            console.log(e)
        });
    }

    genSeed(name,count,document){
        for (let i = 0; i < count; i++) {
            let obj = document({});
            this.seeds.push(obj);
        }
        return {
            name: name,
            seeds : this.seeds
        }
    }

    createGenerator(name,obj){
        return this.dbw.resource(name).insert(obj).catch(e=>{console.log(e)});
    }

    exports (){
        return {
            name: this.name,
            seeds : this.seeds
        }
    }
}


module.exports = Bale;