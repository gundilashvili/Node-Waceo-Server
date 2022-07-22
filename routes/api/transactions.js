const express = require('express')
const router = express.Router() 


// Transaction Model
const Transaction = require('../../models/Transaction') 

// @route    GET api/Transactions
// @desc     Get waceo Transactions
// @access   Public
router.get('/' , ( req, res) => {
    Transaction
    .find() 
    .then(records => { res.send(records)})
    .catch(e => console.log(e));
})
   
module.exports = router
 
 