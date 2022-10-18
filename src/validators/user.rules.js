const joi = require('joi');
const requiredStr = joi.string().required();
const requiredNumber = joi.number().required();
const mongoID = joi.string().regex(/^[a-fA-F0-9]{24}$/);

const keys = (object) => joi.object().keys(object);

exports.changeUserBlockStatus = keys({
    is_blocked: joi.boolean().required(),
})
