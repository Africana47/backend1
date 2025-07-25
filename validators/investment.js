
// const Joi = require('joi');

// const investmentSchema = Joi.object({
//   name: Joi.string().required(),
//   amount: Joi.number().positive().required(),
//   date: Joi.date().required(),
// });

// exports.validateInvestment = (req, res, next) => {
//   const { error } = investmentSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }
//   next();
// };

// module.exports = { validateInvestment };

// backend/validators/investment.js

// const Joi = require('joi');

// // Define the schema
// const investmentSchema = Joi.object({
//   name: Joi.string().required(),
//   amount: Joi.number().positive().required(),
//   date: Joi.date().required()
// });

// // Define the middleware function
// const validateInvestment = (req, res, next) => {
//   const { error } = investmentSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }
//   next();
// };

// // Export it correctly
// module.exports = { validateInvestment };

const Joi = require('joi');

const validateInvestment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = { validateInvestment };


