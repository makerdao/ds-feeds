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
  const type = _type === 'feedbase' ? 'feedbase' : 'aggregator';
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

function runMethod(type, method, args) {
  // status.start();
  utils.getNetwork().then((network) => {
    status.stop();
    prefs.network = network;
    return getDefaultAccount(false);
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
        console.log('Inspecting... Please wait.');
        console.log(JSON.stringify(dapple.inspect(...utils.prepareArgs(args, 'bytes12')), null, 2));
      } else {
        const subMethod = utils.detectMethodArgs(dapple[method], args.length);
        const func = subMethod ? dapple[method][subMethod] : dapple[method];
        const preparedArgs = subMethod ? utils.prepareArgs(args, subMethod) : args;
        console.log('Waiting for your approval... Please sign the transaction.');
        func(...preparedArgs, (e, r) => {
          if (!e) {
            if (!e) {
              if (method === 'claim' ||
                  method === 'set' ||
                  method.indexOf('set_') !== -1 ||
                  method === 'unset') {
                // It means we are calling a writing method
                console.log(`Transaction ${r} was generated. Waiting for confirmation...`);

                dapple.filter({}, (err, id) => {
                  if (err) {
                    console.log('Error: ', err.message);
                  } else if (dapple.owner(id) === prefs.account) {
                    console.log(JSON.stringify(dapple.inspect(id), null, 2));
                  } else {
                    console.warn('Something weird: ', id);
                  }
                  process.exit();
                });
              } else {
                // It means we are calling a read method
                console.log('Result', JSON.stringify(r, null, 2));
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
  .option('-i, --info', 'gets default information');

program
  .command('feedbase <method> [args...]')
  .description('xxx')
  .action((method, args) => {
    console.log({ method, args });
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
