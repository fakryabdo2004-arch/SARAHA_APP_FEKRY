import { Router } from 'express';
import validate from '../middlewares/validate.js';
import upload from '../middlewares/upload.js';
import Joi from 'joi';
import * as ctrl from '../controllers/message.controller.js';

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

const postMessageSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  anonymousName: Joi.string().min(1).max(50).optional()
});

const listQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1)
});

router.post('/:username', upload.single('image'), validate(postMessageSchema), ctrl.createMessage);
router.get('/:username', validate(listQuerySchema, 'query'), ctrl.listMessages);
router.delete('/:username/:messageId', ctrl.deleteMessage);

export default router;