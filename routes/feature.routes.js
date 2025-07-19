const express = require('express');
const router = express.Router();
const {
    createFeature,
    getAllFeatures
} = require('../controllers/feature.controller');

router.post('/', createFeature);
router.get('/', getAllFeatures);

module.exports = router;