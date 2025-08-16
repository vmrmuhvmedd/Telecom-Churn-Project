const express = require('express');
const router = express.Router();
const { predictChurn } = require('../controller/churn.controller');
const { validateChurnInput } = require('../middleware/churn.middleware');

router.post('/predict', validateChurnInput, predictChurn);

module.exports = router;
