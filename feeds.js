#! /usr/bin/env node

const pkg = require('./package.json');
const program = require('commander');
const CLI = require('clui');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const web3 = require('./web3');
const utils = require('./utils');
const feedbase = require('./feedbase');
const aggregator = require('./aggregator');

const Spinner = CLI.Spinner;
let prefs = new Preferences('com.makerdao.feeds');

const status = new Spinner('Connecting to network...');

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences')
  .option('-a, --account [account]', 'set default account')
  .option('-i, --info', 'gets default information');

program
  .command('claim <type> [optional]')
  .description('claims a feed or an aggregator')
  .option('-a, --address <address>', 'sets a new contract address')
  .action((cmd, optional) => {
    status.start();
    if (optional) {
      console.log(optional);
    }
    utils.getNetwork().then((network) => {
      status.stop();
      prefs.network = network;
      if (!web3.eth.defaultAccount) {
        getDefaultAccount(false).then((answer) => {
          prefs.account = answer.account;
          web3.eth.defaultAccount = answer.account;
        });
      }
      console.log('mmm');
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
  console.log('    $ feeds claim feed');
  console.log('    $ feeds claim aggregator -a 0x1234...');
  console.log('    $ feeds inspect feed 1');
  console.log('');
});

program.parse(process.argv); // end with parse to parse through the input

if (program.clear) {
  prefs = {};
  console.log('Cleared preferences');
}

if (program.account) {
  if (program.account === true) {
    getDefaultAccount(true).then((answer) => {
      prefs.account = answer.account;
      web3.eth.defaultAccount = answer.account;
      console.log('Set default account');
    });
  } else if (web3.isAddress(program.account)) {
    prefs.account = program.account;
    web3.eth.defaultAccount = program.account;
    console.log('Set default account');
  } else {
    console.log('Error: account invalid');
  }
}

if (!program.args.length && !program.account) program.help();

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

function askForAddress(_type) {
  const type = _type === 'feed' ? 'feedbase' : 'aggregator';
  const questions = [
    {
      name: type,
      message: `Enter ${type} address:`,
      type: 'input',
      validate: (str) => {
        web3.isAddress(str);
      },
    },
  ];
  return inquirer.prompt(questions);
}

function getDefaultAccount(force = false) {
  if (prefs.account && !force) {
    return new Promise(resolve => resolve(prefs.account));
  }
  const questions = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts,
    },
  ];
  return inquirer.prompt(questions);
}
