import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { connect } from './config/db.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

await connect();

app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
});