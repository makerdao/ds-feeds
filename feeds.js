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

function getDefaultAccount(force = false) {
  if (prefs.account && !force) {
    return Promise.resolve({ answer: prefs.account });
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

function askForAddress(_type) {
  const type = _type === 'feed' ? 'feed' : 'aggregator';
  // if (prefs[type]) {
  //   return Promise.resolve(prefs[type]);
  // }
  const questions = [
    {
      name: 'address',
      message: `Enter ${type} address:`,
      type: 'input',
      default: prefs[type] || '',
      validate: str => (
        web3.isAddress(str) || 'Invalid address'
      ),
    },
  ];
  return inquirer.prompt(questions);
}

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences')
  .option('-a, --account [account]', 'set default account')
  .option('-i, --info', 'gets default information');

program
  .command('claim <type> [optional]')
  .description('claims a feed or an aggregator')
  .option('-s, --set <address>', 'sets a new contract address')
  .action((cmd, optional) => {
    status.start();
    if (optional) {
      console.log(optional);
    }
    utils.getNetwork().then((network) => {
      status.stop();
      prefs.network = network;
      return getDefaultAccount(false);
    })
    .then((answer) => {
      prefs.account = answer.account;
      web3.eth.defaultAccount = answer.account;
      return askForAddress(cmd);
    })
    .then((answer) => {
      prefs[cmd] = answer.address;
      console.log(JSON.stringify(prefs, null, 2));
      const dapple = cmd === 'feed' ? feedbase(answer.address, prefs.network) : aggregator(answer.address, prefs.network);
      status.message(`Claiming ${cmd}. Please authorize transaction.`);
      status.start();
      // not working??
      // dapple.owner(utils.toBytes12(1), (e, r) => console.log(r));
      dapple.claim({ from: web3.eth.defaultAccount }, (error, tx) => {
        if (error) {
          status.stop();
          console.log('There was an error processing your transaction');
        } else {
          status.message(`Transaction ${tx} pending! Waiting for confirmation...`);
          // Set up filter
          dapple.filter({}, (err, id) => {
            status.stop();
            if (err) {
              console.log('Error: ', err.message);
            } else if (dapple.owner(id) === prefs.account) {
              console.log(JSON.stringify(dapple.inspect(id), null, 2));
            } else {
              console.warn('Something weird: ', id);
            }
            process.exit();
          });
        }
      });
    })
    .catch((error) => {
      status.stop();
      console.log(error);
      process.exit(1);
    });
  });

program
  .command('inspect <type> <id>')
  .description('inspect a feed or an aggregator')
  .action((cmd, id) => {
    if (cmd !== 'feed' && cmd !== 'aggregator') {
      console.log('Error: <type> must be "feed" or "aggregator"');
      // process.exit(1);
    } else {
      status.start();
      utils.getNetwork().then((network) => {
        status.stop();
        prefs.network = network;
        return getDefaultAccount(false);
      })
      .then((answer) => {
        prefs.account = answer.account;
        web3.eth.defaultAccount = answer.account;
        return askForAddress(cmd);
      })
      .then((answer) => {
        status.message(`Inspecting ${cmd}. Please wait.`);
        status.start();
        prefs[cmd] = answer.address;
        const dapple = cmd === 'feed' ? feedbase(answer.address, prefs.network) : aggregator(answer.address, prefs.network);
        // not working??
        const result = dapple.inspect(id);
        status.stop();
        console.log(JSON.stringify(result, null, 2));
      })
      .catch((error) => {
        status.stop();
        console.log(error);
        process.exit(1);
      });
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

if (program.info) {
  console.log(JSON.stringify(prefs, null, 2));
}

// if (!program.args.length && !program.account) program.help();
