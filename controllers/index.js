const covidImpactEstimator = require('../lib/estimator');
const convert = require('xml-js');
const periodTypes={days:'days',weeks:'weeks',months:'months'}

const validateBody = (req) => {
    const data = {region:{}};
    const errors = {}
    
    let periodType =typeof req.body.periodType === 'string' && req.body.periodType.length >0?req.sanitize(req.body.periodType.trim()):false;
    let timeToElapse= typeof req.body.timeToElapse === 'number' && req.body.timeToElapse >=0?req.body.timeToElapse:false;
    let reportedCases= typeof req.body.reportedCases === 'number' && req.body.reportedCases >=0?req.body.reportedCases:false;
    let population= typeof req.body.population === 'number' && req.body.population >=0?req.body.population:false;
    let totalHospitalBeds= typeof req.body.totalHospitalBeds === 'number' && req.body.totalHospitalBeds >=0?req.body.totalHospitalBeds:false;
    let avgAge= typeof req.body.region.avgAge === 'number' && req.body.region.avgAge >=0?req.body.region.avgAge:false;
    let avgDailyIncomeInUSD= typeof req.body.region.avgDailyIncomeInUSD === 'number' && req.body.region.avgDailyIncomeInUSD >=0?req.body.region.avgDailyIncomeInUSD:false;
    let avgDailyIncomePopulation= typeof req.body.region.avgDailyIncomePopulation === 'number' && req.body.region.avgDailyIncomePopulation >=0?req.body.region.avgDailyIncomePopulation:false;
    let name= typeof req.body.region.name === 'string' && req.body.region.name.length >0?req.sanitize(req.body.region.name.trim()):false;
    if(periodType === periodTypes.days || periodType === periodTypes.weeks || periodTypes.months ) data.periodType=periodType;
    else errors.periodType="Required field, must be one of days, weeks or months"

    if(name ) data.region.name=name;
    else errors.region?errors.region.name = "Required field, must be  a string":errors.region={ name:"Required field, must be a string"};

    if(typeof timeToElapse === 'number') data.timeToElapse=timeToElapse;
    else errors.timeToElapse = "Required, must be a number";

    if(typeof reportedCases === 'number') data.reportedCases = reportedCases;
    else errors.reportedCases = "Required, must be a number";

    if(typeof population === 'number') data.population = population;
    else errors.population = "Required, must be a number";

    if(typeof totalHospitalBeds === 'number') data.totalHospitalBeds = totalHospitalBeds;
    else errors.totalHospitalBeds = "Required, must be a number";

    if(typeof avgAge === 'number') data.region.avgAge = avgAge;
    else errors.region?errors.region.avgAge = "Required, must be a number":errors.region={ avgAge: "Required, must be a number"};

    if(typeof avgDailyIncomeInUSD === 'number') data.region.avgDailyIncomeInUSD = avgDailyIncomeInUSD;
    else errors.region?errors.region.avgDailyIncomeInUSD = "Required, must be a number":errors.region={ avgDailyIncomeInUSD: "Required, must be a number"};

    if(typeof avgDailyIncomePopulation === 'number') data.region.avgDailyIncomePopulation = avgDailyIncomePopulation;
    else errors.region?errors.region.avgDailyIncomePopulation = "Required, must be a number":errors.region={ avgDailyIncomePopulation: "Required, must be a number"};

    return {errors, data};
} 
module.exports = {
    jsonController: function(req, res, next) {
        try{
            const { errors, data} = validateBody(req);
            if(Object.keys(errors).length > 0){
                res.set({
                    'Content-Type':"application/json"
                });
                res.status(400).send({...errors});
            }
            else {
                const results=covidImpactEstimator(data);
                res.set({
                    'Content-Type':"application/json"
                });
                res.status(200).send(results);
            }
        }
        catch(err) {
            //console.log(err)
        }
        
    },
    xmlController: function(req,res,next) {
        try{
            const { errors, data} = validateBody(req);
            if(Object.keys(errors).length > 0){
                res.set({
                    'Content-Type':"application/json"
                });
                res.status(400).send({...errors});
            }
            else {
                const results=covidImpactEstimator(data);
                const xml = convert.js2xml(results,{compact:true, spaces:4})
                res.set({
                    'Content-Type':"application/xml"
                });
                res.status(200).send(xml);
            }
        }
        catch (err) {
            //console.log(err)
        }
       
    }
}