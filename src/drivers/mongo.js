const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const Driver = require("./driver");

class MongoDriver extends Driver {
    connect() {
        const {user = "", password = "", host = "localhost", port = "27017", dbname = "baleDB"} = this.config;
        const url = this.createConnectionString(user, password, host, port, dbname);
    
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function(err, db) {
                if (err) reject(err);
                return resolve(db)
            });
        })            
        .then(db => {
            this.db = db;
            db.dropDatabase();
        }).catch(console.log);
    }

    createConnectionString(user, password, host, port, dbname) {
        const credentials = user && password? `${user}:${password}@` : "";
        return `mongodb://${credentials}${host}:${port}/${dbname}`;
    }

    insert(resourceName, data) {
        return this.db.collection(resourceName).insert(data);
    }
}


module.exports = MongoDriver;