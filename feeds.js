#! /usr/bin/env node

const pkg = require('./package.json');
const prettyjson = require('prettyjson');
const program = require('commander');
const CLI = require('clui');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const web3 = require('./web3');
const utils = require('./utils');
const feedbase = require('./feedbase');
const aggregator = require('./aggregator');

const Spinner = CLI.Spinner;
const status = new Spinner('Connecting to network...');

const prefs = new Preferences('com.makerdao.feeds');

function dump(data, options = {}) {
  console.log(prettyjson.render(data, options));
}

function clearPreferences() {
  Object.keys(prefs).forEach((prop) => {
    delete prefs[prop];
  });
}
function showAccountSelector() {
  const question = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts,
    },
  ];
  return inquirer.prompt(question);
}

function getDefaultAccount() {
  if (prefs.account) {
    return Promise.resolve({ account: prefs.account });
  }
  return showAccountSelector();
}

function askForAddress(_type) {
  const type = _type === 'feedbase' ? 'feedbase' : 'aggregator';
  if (prefs[type]) {
    return Promise.resolve({ address: prefs[type] });
  }
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

function inspect(type, id) {
  // status.start();
  utils.getNetwork().then((network) => {
    status.stop();
    prefs.network = network;
    return getDefaultAccount();
  })
  .then((answer) => {
    console.log('Answer: ', answer);
    prefs.account = answer.account;
    web3.eth.defaultAccount = answer.account;
    return askForAddress(type);
  })
  .then((answer) => {
    status.message(`Inspecting ${type}. Please wait.`);
    status.start();
    prefs[type] = answer.address;
    const dapple = type === 'feedbase' ? feedbase(answer.address, prefs.network) : aggregator(answer.address, prefs.network);
    // not working??
    const result = dapple.inspect(id);
    status.stop();
    dump(result);
  })
  .catch((error) => {
    status.stop();
    console.log(error);
    process.exit(1);
  });
}

function runMethod(type, method, args) {
  // status.start();
  utils.getNetwork().then((network) => {
    status.stop();
    prefs.network = network;
    return getDefaultAccount();
  })
  .then((answer) => {
    prefs.account = answer.account;
    web3.eth.defaultAccount = answer.account;
    return askForAddress(type);
  })
  .then((answer) => {
    status.message(`Inspecting ${type}. Please wait.`);
    status.start();
    prefs[type] = answer.address;
    const dapple = type === 'feedbase' ? feedbase(answer.address, prefs.network) : aggregator(answer.address, prefs.network);
    if (dapple[method]) {
      if (method === 'inspect') {
        dump(dapple.inspect(args[0]));
      } else {
        args[0] = utils.toBytes12(args[0]);
        dapple[method](...args);
        dapple.filter({}, (err, id) => {
          if (err) {
            console.log('Error: ', err.message);
          } else if (dapple.owner(id) === prefs.account) {
            dump(dapple.inspect(id));
          } else {
            console.warn('Something weird: ', id);
          }
          process.exit();
        });
      }
    }
    status.stop();
    // console.log(JSON.stringify(dapple['claim'], null, 2));
  })
  .catch((error) => {
    status.stop();
    console.log(error);
    process.exit(1);
  });
}

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences')
  .option('-a, --account [account]', 'set default account')
  .option('-i, --info', 'prints default information');

program
  .command('feedbase <method> [args...]')
  .description('xxx')
  .action((method, args) => {
    runMethod('feedbase', method, args);
  });

program
  .command('aggregator <method> [args...]')
  .description('xxx')
  .action((method, args) => {
    if (method === 'inspect') {
      inspect('aggregator', args[0]);
    }
    console.log({ method, args });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ feeds feedbase claim');
  console.log('    $ feeds feedbase set-label 3 "My Label"');
  console.log('    $ feeds aggregator claim -a 0x929be46495338d84ec78e6894eeaec136c21ab7b');
  console.log('    $ feeds aggregator inspect 1');
  console.log('');
});

program.parse(process.argv); // end with parse to parse through the input

if (program.clear) {
  clearPreferences();
  console.log('Cleared preferences.');
}

if (program.account) {
  if (program.account === true) {
    // prefs.account = answer.account;
    // web3.eth.defaultAccount = answer.account;
    console.log('Set default account');
  } else if (web3.isAddress(program.account)) {
    prefs.account = program.account;
    web3.eth.defaultAccount = program.account;
    console.log('Set default account');
  } else {
    console.log('Error: account invalid');
  }
}

if (program.info) {
  dump(prefs);
}

// if (!program.args.length && !program.account) program.help();
