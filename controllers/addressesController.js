require('dotenv').config();

let axios_googleapis = require('../plugins/axios-googleapis').create();
const Dataset = require('../model/Dataset');
let dataset = new Dataset();
// const {Client} = require("@googlemaps/google-maps-services-js");
// const googleServeice = new Client({});
//https://developers.google.com/maps/documentation/distance-matrix/overview#maps_http_distancematrix-js
dataset.initialize();
    
const poi = async (req, res,next) => {

    let address = req.query.street_address;
    let n = req.query.n ?req.query.n : 10;

    try{

        let origins = address;
        let promises =[];
        // let output = [];
        
        for(let i=0;i<dataset.getDataset().length;i =i+20){
            let promise = ()=>{
                if(!address || address == '') throw new Error('Please provide street_address param')
                let fromIndex = i;
                let toIndex = i+19;
                return new Promise(async (resolve,reject) => {
                    try{
                        let output = [];
                        console.log(fromIndex,toIndex);
                        let destinations = dataset.addressesString(fromIndex,toIndex);
                        let result = await axios_googleapis.get(`distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
                        if(result.data.rows && result.data.rows[0] && result.data.rows[0].elements){
                            result.data.rows[0].elements.forEach((element,index) => {
                                if(element.status == 'OK'){
                                    let name = dataset.getDataset()[fromIndex+index].getName();
                                    let toAddress = dataset.getDataset()[fromIndex+index].getAddress().getStreetAddress();
                                    output.push({name,toAddress,distance:element.distance});
                                }
                            });
                        }
                        resolve(output)
                    }catch(err){
                        reject(err);
                    }
                })
            };
            promises.push(promise());
        }

        let output = await Promise.allSettled(promises)
                         .then((results) => {
                            let out = [];
                            results.forEach(e => {
                                out = out.concat(e.value)
                            })
                            return out;
                        })
                         .then((result) =>{
                            return result.sort(function(a, b){
                                if ( a.distance.value < b.distance.value ){
                                    return -1;
                                  }
                                  if ( a.distance.value > b.distance.value ){
                                    return 1;
                                  }
                                  return 0;
                            });
                         })
                         .catch(err => {
                             throw new Error('Some Problem occured')
                         })

        return res.json({result: output.splice(0,n)})
    }catch(err){
        return res.json({err})
    }

}

const getAll = (req,res,next) => {
    try{
        let result = dataset.getDataset().map(e => { return {name: e.getName(),address:e.getAddress().getStreetAddress()}});
        return res.json(result);
    }catch(err){
        return res.status(500).json({status:500,error: err})
    }
}

module.exports =  {
    poi,
    getAll
};