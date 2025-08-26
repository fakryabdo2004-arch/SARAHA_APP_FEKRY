import { Router } from 'express';
import validate from '../middlewares/validate.js';
import Joi from 'joi';
import * as ctrl from '../controllers/user.controller.js';

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().optional()
});

router.post('/', validate(createUserSchema), ctrl.createUser);
router.get('/:username', ctrl.getPublicProfile);

export default router;