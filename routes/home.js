const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /:
 *      get:
 *          description: Mock-up endpoint
 *          tags:
 *              - home
 */
router.get('/', (req, res) => {
    res.send('Testownik - main page');
});

module.exports = router;