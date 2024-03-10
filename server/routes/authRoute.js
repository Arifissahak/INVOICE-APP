const express = require('express');
const { 
        createUser,
        loginUserCtrl,
        updateaUser,
        createClient,
        findAllClient,
        findClientByUsername,
        deleteClient,
        logout
      } = require('../controller/userCtrl');
const { authMidlleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register',createUser);
router.post('/login', loginUserCtrl);

router.get('/logout', authMidlleware, logout);
router.get('/client', authMidlleware, findAllClient);
router.get('/client/:username', authMidlleware, findClientByUsername);

router.post('/client', authMidlleware, createClient);
router.put('/edit-user', authMidlleware, updateaUser);

router.delete('/client/:id', authMidlleware, deleteClient);


module.exports = router;