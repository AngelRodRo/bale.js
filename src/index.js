
const fs = require("fs");
const Bale = require("../src/bale");
const config = require("../samples/config");


module.exports = function () {
    const relativePath = "../seeders";
    fs.readdir(relativePath, function (err, files) {
        const bale = new Bale();

        bale.connect().then(function () {
            for (const file of files) {
                const seeder = require(relativePath + "/" + file);
                bale.use(seeder)
            }
    
            bale.seed();
        })
    })
}
