const router = require('express').Router();
const Pot = require('../Models/Pot');
const User=require('../Models/User')
const Review = require('../Models/Review')
const potController=require('../Controllers/potController')




/// add-pot 
router.post('/add-pot',potController.addPot)
// insert Many 
router.post('/insert-many',potController.InsertMany)
/// update-pot 
router.put('/update-pot',potController.updatePot)
 // delete-pot 
router.delete('/delete-pot',potController.deletePot)
// delete all pots
router.delete('/delete-all-pots',potController.deleteAllPots)
// get-all-pots
router.get('/getAll',potController.getAll)
// getPot-byId
router.get('/getPot-byId/:id',potController.getPotById)
// filter Pots 
router.get('/filter', potController.Filter)
/// get batch of pots (10 for ex)
router.get('/getBatch',potController.getBatch);
/// add review 
router.post('/addReview-toPot/:potId',potController.addReview)




    
module.exports=router