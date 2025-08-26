import chalk from 'chalk';

const colors = {
  red: chalk.red.bold,
  yellow: chalk.yellow.bold,
  green: chalk.green.bold,
  cyan: chalk.cyan.bold
};

const info = (...args) => console.log(chalk.cyan('[INFO]'), ...args);
const warn = (...args) => console.warn(chalk.yellow('[WARN]'), ...args);
const error = (...args) => console.error(chalk.red('[ERROR]'), ...args);
const success = (...args) => console.log(chalk.green('[OK]'), ...args);

export default { info, warn, error, success, colors };