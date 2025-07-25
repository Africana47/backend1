const multer = require('multer');
const path = require('path');
// const uploadKYC = require('../middleware/kycUpload');
const upload = multer({ dest: 'uploads/' }); // Or your multer config
module.exports = upload;

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/kyc');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter files (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const uploadKYC = multer({ storage, fileFilter });

module.exports = uploadKYC;
