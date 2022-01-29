const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const datasetPath = path.join(__dirname, '../lib/sample_dataset.csv');
const User = require('./User');

module.exports = class Dataset {
    #dataset;
    constructor(){
        this.#dataset = [];
    }
    initialize(){
        this.#csvJSON();
    }
    getDataset(){
        return this.#dataset;
    }
    addressesString(fromIndex,toIndex){
        let destinations = '';
        this.#dataset.slice(fromIndex,toIndex).forEach((e,index)=>{
            if(e !== null) destinations+= e.getAddress().getStreetAddress() + '|';
        })
        return destinations;
    }
    #csvJSON(){
            return new Promise((resolve,reject) => {
                try{
                    fs.createReadStream(datasetPath)
                    .pipe(csv())
                    .on('data', (row) => {
                      let user = new User(row.name,row.address);
                      this.#dataset.push(user);
                    })
                    .on('end', () => {
                      console.log('CSV file successfully processed');
                      resolve(this.#dataset);
                    });
                }catch(err){
                    reject(err);
                }
            })
      }
}
