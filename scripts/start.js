'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}


if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const config = configFactory('development');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const { checkBrowsers } = require('react-dev-utils/browsersHelper');

function handle(err, stats) {
  let messages;
  if (err) {
    if (!err.message) {
      return console.error(err);
    }

    let errMessage = err.message;

    // Add additional information for postcss errors
    if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
      errMessage +=
        '\nCompileError: Begins at CSS selector ' +
        err['postcssNode'].selector;
    }

    messages = formatWebpackMessages({
      errors: [errMessage],
      warnings: [],
    });
  } else {
    messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );
  }
  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    return console.error(new Error(messages.errors.join('\n\n')));
  }
  if (
    process.env.CI &&
    (typeof process.env.CI !== 'string' ||
      process.env.CI.toLowerCase() !== 'false') &&
    messages.warnings.length
  ) {
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n' +
        'Most CI servers set it automatically.\n'
      )
    );
    return console.error(new Error(messages.warnings.join('\n\n')));
  }
  console.log(chalk.green(new Date(), '编译成功……'))
}

checkBrowsers(paths.appPath, isInteractive).then(() => {
  const compiler = webpack(config, handle)
  console.log(chalk.cyan('开始编译……'))
  compiler.watch([], ['./src'], [], 100, {}, (e) => {
    console.log('callback ====>', e);
  }, (u) => {
    console.log('callbackUndelayed ====>', u);
  })
})
