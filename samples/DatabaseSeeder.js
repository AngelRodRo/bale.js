"use strict";
const userSeeder = require("./UserSeeder");
const Bale = require("../index");  
const opts = {};

const bale = new Bale();

bale.connect(opts).then((seeder)=>{
    seeder.use(userSeeder);
    seeder.seed().then((msg) => {
        process.exit();
    });
})

