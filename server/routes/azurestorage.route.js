const { UploadFileToAzureStorage } = require('../controllers/azurestorage.controller');
const { verifyToken } = require('../middleware/tokenVerify');

const router = require('express').Router();

router.post('/upload/file', UploadFileToAzureStorage);

module.exports = router;