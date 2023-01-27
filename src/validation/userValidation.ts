export {};
const { body,check } = require('express-validator');

exports.validationBodyRules = [
    check('mobile')
    .trim()
    .isNumeric()
    .withMessage('Phone number must be numeric.')
    .bail()
    .isLength({max: 10, min: 10})
    .withMessage('Phone number must be 10 digits long.')
    .bail(),
];
