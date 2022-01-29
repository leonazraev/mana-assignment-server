const express = require('express');

const {poi,getAll} = require('../controllers/addressesController');

const router = express.Router();
router.get('/', getAll);
router.get('/poi', poi);
module.exports = router;