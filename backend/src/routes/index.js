const express = require('express');
const router = express.Router();
const infoRoutes = require('./information');

router.use('/information', infoRoutes);

module.exports = router;