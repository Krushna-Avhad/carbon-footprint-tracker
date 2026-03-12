const Activity = require('../models/ActivityM')
const calculateCO2 = require('../utils/calculateCO2')

const createActivity = async (req,res)=>{

try{

const {type,data} = req.body

const co2 = calculateCO2(type,data)

const activity = await Activity.create({
 userId:req.user.id,
 type,
 data,
 co2Emissions:co2
})

res.json(activity)

}catch(err){
res.status(500).json({message:err.message})
}

}

const getActivities = async(req,res) => {
    try{
    const activity = await Activity.find({});
    res.json(activity)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = {createActivity,getActivities}