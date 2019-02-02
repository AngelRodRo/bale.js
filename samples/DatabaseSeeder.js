"use strict";
const userSeeder = require("./UserSeeder");
const Bale = require("../src/bale");  
const opts = {};

const bale = new Bale();

bale.connect(opts).then(()=>{
    bale.use(userSeeder);
    bale.seed().then(() => {
        process.exit();
    });
})

