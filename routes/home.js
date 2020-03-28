const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Testownik - main page');
});

module.exports = router;