#! /usr/bin/env node
'use strict';

let feedbase = {};
let aggregator = {};

const pkg = require('./package.json');
const program = require('commander');
var CLI = require('clui');
var Spinner = CLI.Spinner;
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Web3 = require('web3');

var prefs = new Preferences('feeds');

program
  .version(pkg.version)
  .option('-o, --option','option description')
  .option('-i, --input [optional]','optional user input')
  .option('-I, --another-input <required>','required user input')
  .command('claim <type> [optional]')
  .description('Claims a new feed or aggregator')
  .action((req, optional) => {
    console.log('.action() allows us to implement the command');
    console.log('User passed %s', req);
    if (optional) {
      console.log('found options');
      optional.forEach(function(opt){
        console.log("User passed optional arguments: %s", opt);
      });
    }
    claim();
  });
  
program
  .command('inspect <type> <id> [optional]')
  .description('Inspect a feed or aggregator')
  .action((req, optional) => {
    inspect();
  });

program.parse(process.argv); // end with parse to parse through the input

function init() {
  const Feedbase = require("./lib/feedbase.js");
  const Aggregator = require("./lib/aggregator.js");

  Aggregator.environments.ropsten.aggregator.value = '0x509a7c442b0f8220886cfb9af1a11414680a6749';
  Feedbase.environments.ropsten.feedbase.value = '0x929be46495338d84ec78e6894eeaec136c21ab7b';
  
  feedbase = new Feedbase.class(web3, env).objects.feedbase
  aggregator = new Aggregator.class(web3, env).objects.aggregator
}

function toBytes12(number) {
  return toBytes(number, 12);
}

function toBytes(number, bytes) {
  let hex = web3.fromDecimal(number).replace('0x', '');
  while (hex.length < bytes * 2) hex = '0' + hex;
  return hex;
}

let web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider("http://localhost:8545")
))

var status = new Spinner('Getting network version...');

function askForFeedbase(callback) {
  var questions = [
    {
      name: 'feedbase',
      message: 'Enter a feedbase address:',
      type: 'input',
      default: '0x929be46495338d84ec78e6894eeaec136c21ab7b',
      validate: (str) => {
        return web3.isAddress(str);
      }
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function askForAggregator(callback) {
  var questions = [
    {
      name: 'aggregator',
      message: 'Enter an aggregator address:',
      type: 'input',
      default: '0x509a7c442b0f8220886cfb9af1a11414680a6749',
      validate: (str) => {
        return web3.isAddress(str);
      }
    },
  ];
  inquirer.prompt(questions).then(callback);
}

status.start();
setTimeout(getNetwork, 1000);

function getNetwork() {
  web3.version.getNetwork((error,network) => {
    status.stop();
    if (error) {
      console.log('Not connected to Ethereum');
    } else {
      if (network > 3) { network = 4; }
      const env = [, "live", "morden", "ropsten", "develop"][network];
      console.log(`Current environment: ${env}`);

      if (!prefs.feeds.account) {
        getDefaultAccount(r => {
          prefs.feeds.account = r.account;
          getBalance(r.account);
        });
      }
      if (!prefs.feeds.feedbase) {
        askForFeedbase((r) => {
          prefs.feeds.feedbase = r.feedbase;
        });
      }
      if (!prefs.feeds.aggregator) {
        askForAggregator((r) => {
          prefs.feeds.aggregator = r.aggregator;
        });
      }
    }
  });
}

function claim() {
  console.log('CLAIM');
}

function inspect() {
  console.log('INSPECT');
}

function getDefaultAccount(callback) {
  var questions = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function getBalance(account) {
  web3.eth.getBalance(account, (e, r) => {
    prefs.feeds.balance = r.valueOf();
  });
}
