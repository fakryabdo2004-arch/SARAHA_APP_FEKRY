
const { Router } = require('express');
const userRoutes = require('./user.routes');
const messageRoutes = require('./message.routes');

const router = Router({ caseSensitive: true, strict: false, mergeParams: true });

router.use('/users', userRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
