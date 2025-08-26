import Joi from 'joi';

export default (schema, property = 'body') => (req, res, next) => {
  const options = { abortEarly: false, allowUnknown: false, stripUnknown: true };
  const { value, error } = schema.validate(req[property], options);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => ({ message: d.message, path: d.path }))
    });
  }
  req[property] = value;
  next();
};