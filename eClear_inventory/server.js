const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors'); // This allows your HTML to talk to your Server

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use "Unknown" if the AI guess is rejected
        const carName = req.body.carName ? req.body.carName.replace(/\s+/g, '_') : 'Unknown_Vehicle';
        const status = req.body.isValidated === 'true' ? 'confirmed' : 'review';
        const dir = `./eClear_Brain_Data/${status}/${carName}`;
        
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload-batch', upload.array('photos', 15), (req, res) => {
    console.log(`✅ Received ${req.files.length} photos for: ${req.body.carName}`);
    res.json({ message: "Success", count: req.files.length });
});

app.listen(3000, () => console.log('🚀 eClear Backend running on Port 3000'));