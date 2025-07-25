// controllers/documentController.js

const path = require('path');
const fs = require('fs');
// const PDFDocument = require('pdfkit');
const multer = require('multer');
const User = require('../models/User');
const Investment = require('../models/Investment');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${req.user.id}-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ========== CONTROLLERS ==========

// @desc Upload KYC document
// @route POST /api/documents/kyc
// @access Private
exports.uploadKycDocument = [
  upload.single('document'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const user = await User.findById(req.user.id);
      user.kyc = {
        document: req.file.path,
        status: 'pending',
        uploadedAt: new Date(),
      };
      await user.save();

      res.status(201).json({
        message: 'KYC document uploaded successfully',
        documentPath: req.file.path,
      });
    } catch (error) {
      console.error('KYC upload error:', error);
      res.status(500).json({ message: 'Failed to upload KYC document' });
    }
  }
];

// @desc Download KYC document
// @route GET /api/documents/kyc
// @access Private
exports.downloadKycDocument = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.kyc || !user.kyc.document) {
      return res.status(404).json({ message: 'No KYC document found.' });
    }

    res.download(path.resolve(user.kyc.document));
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading KYC document' });
  }
};

// @desc Generate portfolio PDF report
// @route GET /api/documents/portfolio-report
// @access Private
exports.generatePortfolioReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const investments = await Investment.find({ user: req.user.id });

    const doc = new PDFDocument();
    const filename = `Portfolio_Report_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, `../uploads/documents/${filename}`);
    const writeStream = fs.createWriteStream(filepath);

    doc.pipe(writeStream);

    // Header
    doc.fontSize(18).text('Portfolio Performance Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Generated On: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Investments Summary');
    doc.moveDown(0.5);

    investments.forEach((inv, index) => {
      doc.fontSize(12).text(`${index + 1}. ${inv.title}`);
      doc.text(`   Amount: $${inv.amount}`);
      doc.text(`   Returns: $${inv.returns}`);
      doc.text(`   Created: ${new Date(inv.createdAt).toLocaleDateString()}`);
      doc.moveDown(0.5);
    });

    doc.end();

    writeStream.on('finish', () => {
      res.download(filepath, filename);
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating portfolio report' });
  }
};
