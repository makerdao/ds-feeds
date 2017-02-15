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
    prefs[type] = answer.address;
    const dapple = type === 'feedbase' ? feedbase(answer.address, prefs.network) : aggregator(answer.address, prefs.network);
    if (dapple[method]) {
      if (method === 'inspect') {
        console.log('Getting result... Please wait.');
        dump(dapple.inspect(...utils.prepareArgs(args, 'bytes12')));
      } else {
        const setterMethod = method === 'claim' || method === 'set' || method.indexOf('set_') !== -1 || method === 'unset';
        const subMethod = utils.detectMethodArgs(dapple[method], args.length);
        let func = subMethod ? dapple[method][subMethod] : dapple[method];
        func = setterMethod ? func : func.call;
        const preparedArgs = subMethod ? utils.prepareArgs(args, subMethod) : args;
        if (setterMethod) {
          console.log('Waiting for your approval... Please sign the transaction.');
        } else {
          console.log('Getting result... Please wait.');
        }
        func(...preparedArgs, (e, r) => {
          if (!e) {
            if (!e) {
              if (setterMethod) {
                // It means we are calling a writing method
                console.log(`Transaction ${r} was generated. Waiting for confirmation...`);

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
              } else {
                // It means we are calling a read method
                dump(r);
              }
            } else {
              console.warn('Something weird: ', e);
            }
          }
        });
      }
    }
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
    console.log({ method, args });
    runMethod('aggregator', method, args);
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
