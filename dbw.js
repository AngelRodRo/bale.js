

module.exports = function(config){

    let driver = config.driver;
    let db = "";
    let resourceName = "";

    this.resource = function(name){
        resourceName = name;
        return this;    
    }

    this.insert = function(data){
        switch(driver){
            case 'mongodb':
                return this.db.collection(resourceName).insert(data);
                break;
        }
    }

    let mongo = ()=>{
        let mongodb = require('mongodb');
        let MongoClient = mongodb.MongoClient;
        let url = "mongodb://localhost:27017/"+config.dbname;
        
        return function(){
            return new Promise((resolve,reject)=>{
                MongoClient.connect(url,function(err,db){
                    if(err) reject(err);
                    return resolve(db)
                });
            })            
            .then((db)=>{
                
                this.db = db;
                db.dropDatabase();
                return this;
            }).catch(e=>console.log(e));
        }
    }
   

    switch(driver){
        case 'mongodb':
            this.connect = mongo();
            break;
    }

};