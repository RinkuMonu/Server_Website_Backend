const express = require('express');
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  getPlansBySlug,
  getPlanById,
  updatePlan,
  deletePlan
} = require('../controllers/plan.controller');

router.post('/', createPlan);                    
router.get('/', getAllPlans);                   
router.get('/slug/:slug', getPlansBySlug);      
router.get('/:id', getPlanById);              
router.put('/:id', updatePlan);                  
router.delete('/:id', deletePlan);             

module.exports = router;
