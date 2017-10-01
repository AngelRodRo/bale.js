
module.exports = function(config){

    const driver = config.driver;

    if (!driver) {
        throw "Need declare the db driver, before continue";
    }

    let db = "";
    let resourceName = "";

    this.resource = function(name){
        resourceName = name;
        return this;    
    }

    const parseData = (data) => {
        const lengthKeys = Object.keys(data).length;
        const dataKeys = Object.keys(data).join(",");
        const values = Object.values(data);

        let dataValues = "";
        let i;

        for (i = 1; i <= lengthKeys-1; i++) {
            dataValues += `${i},`
        }
        dataValues += `${i+1}`;

        return [dataKeys, dataValues, values];
    }

    this.insert = function(data){
        switch(driver){
            case "mongodb":
                return this.db.collection(resourceName).insert(data);
                break;
            case "postgres":
                const [dataKeys, dataValues, values] = parseData(data);
                const text = `INSERT INTO ${resourceName}(${dataKeys}) VALUES (${dataValues})`;
                return db.query(text, values);
        }
    }

    const mongo = () => {
        const mongodb = require("mongodb");
        const MongoClient = mongodb.MongoClient;
        let credentials = "";

        if (config.user && config.password) {
            credentials = `${config.user}:${config.password}@`;
        }
        const url = `mongodb://${credentials}${config.host}:${config.port}/${config.dbname}`;

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

    const postgres = () => {
        const { Client } = require("pg");

        const client = new Client({
            user: config.user,
            host: config.host,
            database: config.dbname,
            password: config.password,
            port: config.port
        });

        return function() {
            return new Promise((resolve, reject) => {
                client.connect();
                resolve(client);
            })
            .then((client) => {
                this.db = client;
                return this;
            }).catch(e => console.log(e));
        }
    }
   
    switch(driver){
        case "mongodb":
            this.connect = mongo();
            break;
        case "postgres":
            
    }

};