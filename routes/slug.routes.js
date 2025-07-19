const express = require('express');
const router = express.Router();
const slugController = require('../controllers/slug.controller');

router.post('/create-slug', slugController.createSlug);
router.get('/get-all-slugs', slugController.getAllSlugs);

module.exports = router;
