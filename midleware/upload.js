// middleware/upload.js
import multer from 'multer';
import path from 'path';

// Destination de stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier local où enregistrer l'image
  },
  filename: (req, file, cb) => {
    const uniqueName = `image-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
