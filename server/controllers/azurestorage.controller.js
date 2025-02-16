const { BlobServiceClient, generateBlobSASQueryParameters, ContainerSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');
const axios = require('axios')
const multer = require('multer');

const generateAzurePresignedUrlV2 = async (containerName, blobName, accountName, accountKey, expiresInMinutes = 60) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const permissions = new ContainerSASPermissions();
    permissions.read = true; // Permissions for the URL
    permissions.write = true;
    permissions.create = true;


    const sasOptions = {
        containerName,
        blobName,
        permissions,
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + expiresInMinutes * 60 * 1000), // Expiry time
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    console.log(containerName)
    console.log(blobName)
    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    return url;
};
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.UploadFileToAzureStorageV2 = [
    upload.single('file'), 
    async (req, res) => {
        const { blobName, containerName } = req.body; 
        const file = req.file; 
        const accountName = process.env.AZ_ACCOUNT_NAME;
        const accountKey = process.env.AZ_ACCOUNT_KEY;
        console.log(file)

        if (!file || !blobName || !containerName) {
            return res.status(400).send('Missing required parameters or file.');
        }

        try {
            // Generate pre-signed URL for Azure Storage
            const signedUrl = await generateAzurePresignedUrl(containerName, blobName, accountName, accountKey);
            console.log('Generated Signed URL:', signedUrl);


            // Upload the file to Azure Blob Storage
            const response = await axios.put(signedUrl, file.buffer, {
                headers: {
                    'x-ms-date': new Date().toUTCString(),
                    'Content-Type': file.mimetype, 
                    'x-ms-blob-type': 'BlockBlob', 
                    
                },
            });

            res.status(200).send({ message: 'File uploaded successfully!', data: response.data });
        } catch (error) {
            console.error('Error uploading file to Azure:', error);
            res.status(500).send({ error: 'Error uploading file to Azure', details: error.message });
        }
    },
];


const generateAzurePresignedUrl = async (containerName, blobName, accountName, accountKey, expiresInMinutes = 60) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    // Check if the container exists, create it if it doesn't
    const exists = await containerClient.exists();
    if (!exists) {
        await containerClient.create();
        console.log(`Created container: ${containerName}`);
    }

    return blobClient;
};

exports.UploadFileToAzureStorage = [
    upload.single('file'),
    async (req, res) => {
        const { blobName, containerName } = req.body;
        console.log(req.body)
        const file = req.file;
        console.log("File ------------> ")
        console.log(req.file);
        console.log("Buffer length --------------> ")
        // console.log(file.size)
        // console.log('File Buffer Size:', file.buffer.length);
        console.log(file)
        const accountName = process.env.AZ_ACCOUNT_NAME;
        const accountKey = process.env.AZ_ACCOUNT_KEY;
        
        if (!file || !blobName || !containerName) {
            return res.status(400).send('Missing required parameters or file.');
        }

        try {
            // Get the Blob Client
            const blobClient = await generateAzurePresignedUrl(containerName, blobName, accountName, accountKey);

            // Upload the file to Azure Blob Storage
            const uploadResponse = await blobClient.uploadData(file, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype, // Set the content type
                },
            });

            console.log(uploadResponse)
            console.log(blobClient.url)
            res.status(200).send({
                success:true,
                message: 'File uploaded successfully!',
                data: {
                    url: blobClient.url,
                    uploadResponse,
                },
            });
        } catch (error) {
            console.error('Error uploading file to Azure:', error);
            res.status(500).send({ error: 'Error uploading file to Azure', details: error.message });
        }
    },
];
