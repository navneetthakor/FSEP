// creating express router object
const express = require('express');
const router = express.Router();

// importing middleware
const fetchUser = require('../Middelwares/fetchUser.middelware');

// importing controllers 
const addAPIFlow = require("../Controllers/apiFlow/addAPIFlow.controller.js");
const getAllAPIFlow = require("../Controllers/apiFlow/getAllAPIFlow.controller.js");
const getAPIFlow = require("../Controllers/apiFlow/getAPIFlow.controller.js");
const pushAPIFlow = require("../Controllers/apiFlow/pushAPIFlow.controller.js");
const deleteAPIFlow = require("../Controllers/apiFlow/deleteAPIFlow.controller.js");
const updateAPIFlow = require("../Controllers/apiFlow/updateAPIFlow.controller.js");
const startAPIFlow = require("../Controllers/apiFlow/startAPIFlow.controller.js")

// -------------------- Route:1 adding server ---------------
router.post('/add',fetchUser, addAPIFlow);

// ------------------- Route:2.1 get all servers list ---------------
router.get('/getAll',fetchUser,getAllAPIFlow);

// -------------------- Route:2.2 get seerver info ------------
router.get('/getInfo/:server_id',fetchUser, getAPIFlow);

// -------------------- Route: 3 push server -------------
router.put('/push/:server_id', fetchUser, pushAPIFlow);

// -------------------- Route: 4 remove server -----------
router.delete('/delete/:server_id', fetchUser, deleteAPIFlow);

// ------------------- Route: 5 update server ---------
router.put('/update/:server_id', fetchUser, updateAPIFlow);

// ------------------- Route: 6 update server ---------
router.put('/start/:server_id', fetchUser, startAPIFlow);

module.exports = router;