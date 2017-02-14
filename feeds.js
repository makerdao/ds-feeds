#! /usr/bin/env node

const pkg = require('./package.json');
const program = require('commander');
const CLI = require('clui');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const web3 = require('./web3');
const utils = require('./utils');

const Spinner = CLI.Spinner;
let prefs = new Preferences('com.makerdao.feeds');

const status = new Spinner('Connecting to network...');

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences');

program
  .command('claim <type>')
  .description('claims a feed or an aggregator')
  .action((cmd) => {
    status.start();
    utils.getNetwork().then((network) => {
      status.stop();
      prefs.network = network;
      console.log(prefs);
    })
    .catch(() => {
      status.stop();
      console.log('Error connecting to network. Do you have a node running?');
      process.exit(1);
    });
  });

program
  .command('inspect <type> <id>')
  .description('inspect a feed or an aggregator')
  .action((cmd, id) => {
    if (cmd !== 'feed' && cmd !== 'agg') {
      console.log('Error: <type> must be "feed" or "agg"');
      process.exit(1);
    } else {
      console.log('type "%s" id "%s"', cmd, utils.toBytes12(id));
    }
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

program.parse(process.argv); // end with parse to parse through the input

// process.exit(0);

if (program.clear) {
  prefs = {};
  console.log('Cleared preferences');
  console.log(prefs);
  process.exit(0);
}

if (!program.args.length) program.help();

function init() {
  const feedbase = require('./feedbase.js')('0x929be46495338d84ec78e6894eeaec136c21ab7b', 'ropsten');
  return feedbase;
  // const Aggregator = require('./aggregator.js');

  // Aggregator.environments.ropsten.aggregator.value = '0x509a7c442b0f8220886cfb9af1a11414680a6749';
  // Feedbase.environments.ropsten.feedbase.value = '0x929be46495338d84ec78e6894eeaec136c21ab7b';
}

// const f = init();
// f.claim((e,r) => console.log(r));

// var status = new Spinner('Getting network version...');

function askForFeedbase(callback) {
  const questions = [
    {
      name: 'feedbase',
      message: 'Enter a feedbase address:',
      type: 'input',
      default: '0x929be46495338d84ec78e6894eeaec136c21ab7b',
      validate: (str) => {
        web3.isAddress(str);
      },
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function askForAggregator(callback) {
  const questions = [
    {
      name: 'aggregator',
      message: 'Enter an aggregator address:',
      type: 'input',
      default: '0x509a7c442b0f8220886cfb9af1a11414680a6749',
      validate: (str) => {
        web3.isAddress(str);
      },
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function getDefaultAccount(callback) {
  const questions = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts,
    },
  ];
  inquirer.prompt(questions).then(callback);
}
