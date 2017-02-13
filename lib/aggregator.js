'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['feed-aggregator'] = (function builder () {
  var environments = {
      'live': {
        'aggregator': {
          'value': '',
          'type': 'FeedAggregator100[6025ece1f0f5b5dbf0aba9cf5d0f4b0fc7d3c16799c61fc8bb9d27fc59bddfc5]'
        }
      },
      'ropsten': {
        'aggregator': {
          'value': '',
          'type': 'FeedAggregator100[6025ece1f0f5b5dbf0aba9cf5d0f4b0fc7d3c16799c61fc8bb9d27fc59bddfc5]'
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'aggregator': {
          'value': '',
          'type': 'FeedAggregator100[6025ece1f0f5b5dbf0aba9cf5d0f4b0fc7d3c16799c61fc8bb9d27fc59bddfc5]'
        }
      },
      'type': 'ropsten'
    };
    }
    if(typeof env === "object" && !("objects" in env)) {
      env = {objects: env};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = {objects: environments[env]};
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'Callback': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'eventName',
                'type': 'string'
              },
              {
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b6101258061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636985e72414603a575bfe5b3415604157fe5b60f1600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060f3565b005b5b5050505600a165627a7a723058207004b3405f9bdc0ee69aa379f97004956e34f343c03b4465eeb0c5cc38b80a1d0029'
      },
      'SMS': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'number',
                'type': 'string'
              },
              {
                'name': 'message',
                'type': 'string'
              }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b6101058061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bd6de11c14603a575bfe5b3415604157fe5b60d2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060d4565b005b5b50505600a165627a7a723058209afec15780e3ca7279e8c12e7dae38ffc97f533f7aefb03453c343d2d968cf740029'
      },
      'Script': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b5b73509a7c442b0f8220886cfb9af1a11414680a6749600360000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600360020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073509a7c442b0f8220886cfb9af1a11414680a6749600660000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600660020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b727202eeaad2c871c74c094231d1a4d28028321b600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073127202eeaad2c871c74c094231d1a4d28028321b600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6101ef806102996000396000f30060606040523615610055576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635067a4bd146100665780639fc288d1146100a9578063d900596c146100bb575b341561005d57fe5b6100645b5b565b005b341561006e57fe5b6100a760048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100cd565b005b34156100b157fe5b6100b9610145565b005b34156100c357fe5b6100cb610184565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c382826040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16001604051808215151515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16000604051808215151515815260200191505060405180910390a15b5600a165627a7a72305820f15825d134486161e02419980f595936253d143857adb49628f5b02831f11a210029'
      },
      'System': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'input',
                'type': 'string'
              }
            ],
            'name': 'to_uint',
            'outputs': [
              {
                'name': 'output',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b60dd8061001b6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360cfa96314603a575bfe5b3415604157fe5b608f600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060a5565b6040518082815260200191505060405180910390f35b6000600b90505b9190505600a165627a7a723058201ad8e9cd4610adfa5ca6310870353475c3569d695980d80530fc6b82123e26650029'
      },
      'DeployAggregator': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b5b5b73509a7c442b0f8220886cfb9af1a11414680a6749600360000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600360020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073509a7c442b0f8220886cfb9af1a11414680a6749600660000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600660020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b727202eeaad2c871c74c094231d1a4d28028321b600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073127202eeaad2c871c74c094231d1a4d28028321b600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c36102b3610338565b809050604051809103906000f08015156102c957fe5b60405180807f61676772656761746f72000000000000000000000000000000000000000000008152506020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b610348565b6040516121c98061054683390190565b6101ef806103576000396000f30060606040523615610055576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635067a4bd146100665780639fc288d1146100a9578063d900596c146100bb575b341561005d57fe5b6100645b5b565b005b341561006e57fe5b6100a760048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100cd565b005b34156100b157fe5b6100b9610145565b005b34156100c357fe5b6100cb610184565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c382826040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16001604051808215151515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16000604051808215151515815260200191505060405180910390a15b5600a165627a7a723058200d8ee0068d802cae4832f2ad5635a18e4bb561ce8ee6e383b191725bdab457340029606060405260017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff02191690837401000000000000000000000000000000000000000090040217905550341561005f57fe5b5b61215a8061006f6000396000f300606060405236156100e4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302e0c14a146100e65780630ab6ae08146101395780633b25757b146101b25780634e71d92d14610248578063675ff4511461029c578063770eb5bb146102f35780637a177cc61461033757806381031eba146103b05780638981d5131461046857806389ee639d146104df578063ac016a3114610536578063ad7bb77714610589578063aed0a6e614610607578063c9085820146106d3578063cd5f5c4a14610729578063f303b6ac14610787575bfe5b34156100ee57fe5b61011b600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610800565b60405180826000191660001916815260200191505060405180910390f35b341561014157fe5b61016e600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061082a565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156101ba57fe5b610246600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061089a565b005b341561025057fe5b610258610b4e565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156102a457fe5b6102f1600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b77565b005b34156102fb57fe5b610335600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803560001916906020019091905050610cb8565b005b341561033f57fe5b61036c600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610da3565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156103b857fe5b610424600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061103c565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b341561047057fe5b61049d600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506111e9565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156104e757fe5b610534600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611258565b005b341561053e57fe5b61056b600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506114b9565b60405180826000191660001916815260200191505060405180910390f35b341561059157fe5b6105de600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611508565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b341561060f57fe5b61065c600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611724565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019250505060405180910390f35b34156106db57fe5b610727600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611883565b005b341561073157fe5b61075e600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506119c8565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b341561078f57fe5b6107bc600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061207c565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b60006000600061080f846119c8565b9150915080151561081f57610000565b8192505b5050919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160009054906101000a9004740100000000000000000000000000000000000000000290505b919050565b836108da6108a7826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b82600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160146101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508473ffffffffffffffffffffffffffffffffffffffff19167f62ba5ff08854575a78f11e69ef033464759a0d1b4a7737d7532084865ea000fc858585604051808473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001935050505060405180910390a25b5b5050505050565b6000610b7160017401000000000000000000000000000000000000000002610da3565b90505b90565b81610bb7610b84826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160006101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508273ffffffffffffffffffffffffffffffffffffffff19167f61d35bf7f8dd13f0fd458f9819b825bfeff5dfd6f4111a9bbfd93300f778162983604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a25b5b505050565b81610cf8610cc5826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060010181600019169055508273ffffffffffffffffffffffffffffffffffffffff19167f66f3485fca28b64e1fb0ce419f2fe27fc84b3d02de3dd7edc449f5b35a1779028360405180826000191660001916815260200191505060405180910390a25b5b505050565b6000600160009054906101000a900474010000000000000000000000000000000000000000029050610e06600074010000000000000000000000000000000000000000028273ffffffffffffffffffffffffffffffffffffffff1916141561211e565b6001600160009054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555033600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060017401000000000000000000000000000000000000000002600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c6101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508073ffffffffffffffffffffffffffffffffffffffff19167fff320af0a152725afb95a20a16c559e2324e0f998631b6892e0c1f3720415f4933604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a26110338183610b77565b8090505b919050565b60008361107e61104b826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a900474010000000000000000000000000000000000000000029150611121600074010000000000000000000000000000000000000000028373ffffffffffffffffffffffffffffffffffffffff1916141561211e565b600182740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c6101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055506111dc8583868661089a565b8191505b5b509392505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b81611298611265826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b6000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060007401000000000000000000000000000000000000000002600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160146101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508273ffffffffffffffffffffffffffffffffffffffff19167f0be474a55c16887f4473fcdbdcae7da92be6da32d23ccbc2736c511007d8771583604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a25b5b505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b60006000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a900474010000000000000000000000000000000000000000026000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b15156116fb57fe5b60325a03f1151561170857fe5b50505060405180519060200180519050915091505b9250929050565b60006000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a90047401000000000000000000000000000000000000000002915091505b9250929050565b816118c3611890826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff19167ff9748c45e3ee6ce874c66a836fcc6267e8fb43966eec794f6cac34450256ab1d83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b60006000600060006000600060006000600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160009054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900495506001600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004118015611b61575085600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004115b156120705760009350600192505b600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900483101561201b576000600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600085740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561200d57600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600084740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a600060008c73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600086740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a900474010000000000000000000000000000000000000000026000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b1515611eee57fe5b60325a03f11515611efb57fe5b505050604051805190602001805190508098508199505050861561200c576000841480611f44575084600060018603815260200190815260200160002054600019168860001916115b15611f6957878560008681526020019081526020016000208160001916905550612005565b600091505b84600083815260200190815260200160002054600019168860001916101515611f9e578180600101925050611f6e565b8390505b81811115611fe9578460006001830381526020019081526020016000205485600083815260200190815260200160002081600019169055505b808060019003915050611fa2565b8785600084815260200190815260200160002081600019169055505b6001840193505b5b5b8280600101935050611b6f565b60008411801561202b5750858410155b1561205d5784600060026001870381151561204257fe5b04815260200190815260200160002054600197509750612071565b6000600081600102915097509750612071565b5b505050505050915091565b60006001600060008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900403740100000000000000000000000000000000000000000290505b919050565b80151561212a57610000565b5b505600a165627a7a72305820acc85c03d355747b8033be40ce1122f444e9f760fbefea0c64e3beb76156a6310029'
      },
      'DappleLogger': {
        'interface': [],
        'bytecode': '60606040523415600b57fe5b5b60338060196000396000f30060606040525bfe00a165627a7a7230582018111efc4251b6c24f4ba5f5de626060e9ebeeaa023f51410995139277295f9f0029'
      },
      'FeedAggregator100': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'minimumValid',
            'outputs': [
              {
                'name': '',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              },
              {
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'set_minimumValid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'set_label',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'claim',
            'outputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'set',
            'outputs': [
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'unset',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'label',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGetFeed',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              },
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'getFeedInfo',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'set_owner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'name': 'feedsQuantity',
            'outputs': [
              {
                'name': '',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'LogUnset',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'LogMinimumValid',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff02191690837401000000000000000000000000000000000000000090040217905550341561005f57fe5b5b61215a8061006f6000396000f300606060405236156100e4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302e0c14a146100e65780630ab6ae08146101395780633b25757b146101b25780634e71d92d14610248578063675ff4511461029c578063770eb5bb146102f35780637a177cc61461033757806381031eba146103b05780638981d5131461046857806389ee639d146104df578063ac016a3114610536578063ad7bb77714610589578063aed0a6e614610607578063c9085820146106d3578063cd5f5c4a14610729578063f303b6ac14610787575bfe5b34156100ee57fe5b61011b600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610800565b60405180826000191660001916815260200191505060405180910390f35b341561014157fe5b61016e600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061082a565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156101ba57fe5b610246600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061089a565b005b341561025057fe5b610258610b4e565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156102a457fe5b6102f1600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b77565b005b34156102fb57fe5b610335600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803560001916906020019091905050610cb8565b005b341561033f57fe5b61036c600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610da3565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156103b857fe5b610424600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061103c565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b341561047057fe5b61049d600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506111e9565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156104e757fe5b610534600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611258565b005b341561053e57fe5b61056b600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506114b9565b60405180826000191660001916815260200191505060405180910390f35b341561059157fe5b6105de600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611508565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b341561060f57fe5b61065c600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611724565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019250505060405180910390f35b34156106db57fe5b610727600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611883565b005b341561073157fe5b61075e600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506119c8565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b341561078f57fe5b6107bc600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061207c565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b60006000600061080f846119c8565b9150915080151561081f57610000565b8192505b5050919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160009054906101000a9004740100000000000000000000000000000000000000000290505b919050565b836108da6108a7826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b82600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160146101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508473ffffffffffffffffffffffffffffffffffffffff19167f62ba5ff08854575a78f11e69ef033464759a0d1b4a7737d7532084865ea000fc858585604051808473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001935050505060405180910390a25b5b5050505050565b6000610b7160017401000000000000000000000000000000000000000002610da3565b90505b90565b81610bb7610b84826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160006101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508273ffffffffffffffffffffffffffffffffffffffff19167f61d35bf7f8dd13f0fd458f9819b825bfeff5dfd6f4111a9bbfd93300f778162983604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a25b5b505050565b81610cf8610cc5826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060010181600019169055508273ffffffffffffffffffffffffffffffffffffffff19167f66f3485fca28b64e1fb0ce419f2fe27fc84b3d02de3dd7edc449f5b35a1779028360405180826000191660001916815260200191505060405180910390a25b5b505050565b6000600160009054906101000a900474010000000000000000000000000000000000000000029050610e06600074010000000000000000000000000000000000000000028273ffffffffffffffffffffffffffffffffffffffff1916141561211e565b6001600160009054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555033600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060017401000000000000000000000000000000000000000002600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c6101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508073ffffffffffffffffffffffffffffffffffffffff19167fff320af0a152725afb95a20a16c559e2324e0f998631b6892e0c1f3720415f4933604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a26110338183610b77565b8090505b919050565b60008361107e61104b826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a900474010000000000000000000000000000000000000000029150611121600074010000000000000000000000000000000000000000028373ffffffffffffffffffffffffffffffffffffffff1916141561211e565b600182740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c6101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055506111dc8583868661089a565b8191505b5b509392505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b81611298611265826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b6000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060007401000000000000000000000000000000000000000002600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160146101000a8154816bffffffffffffffffffffffff021916908374010000000000000000000000000000000000000000900402179055508273ffffffffffffffffffffffffffffffffffffffff19167f0be474a55c16887f4473fcdbdcae7da92be6da32d23ccbc2736c511007d8771583604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a25b5b505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b60006000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a600060008773ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a900474010000000000000000000000000000000000000000026000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b15156116fb57fe5b60325a03f1151561170857fe5b50505060405180519060200180519050915091505b9250929050565b60006000600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a90047401000000000000000000000000000000000000000002915091505b9250929050565b816118c3611890826111e9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461211e565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff19167ff9748c45e3ee6ce874c66a836fcc6267e8fb43966eec794f6cac34450256ab1d83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b60006000600060006000600060006000600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160009054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900495506001600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004118015611b61575085600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004115b156120705760009350600192505b600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900483101561201b576000600060008b73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600085740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561200d57600060008a73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600084740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a600060008c73ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600301600086740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160149054906101000a900474010000000000000000000000000000000000000000026000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b1515611eee57fe5b60325a03f11515611efb57fe5b505050604051805190602001805190508098508199505050861561200c576000841480611f44575084600060018603815260200190815260200160002054600019168860001916115b15611f6957878560008681526020019081526020016000208160001916905550612005565b600091505b84600083815260200190815260200160002054600019168860001916101515611f9e578180600101925050611f6e565b8390505b81811115611fe9578460006001830381526020019081526020016000205485600083815260200190815260200160002081600019169055505b808060019003915050611fa2565b8785600084815260200190815260200160002081600019169055505b6001840193505b5b5b8280600101935050611b6f565b60008411801561202b5750858410155b1561205d5784600060026001870381151561204257fe5b04815260200190815260200160002054600197509750612071565b6000600081600102915097509750612071565b5b505050505050915091565b60006001600060008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201600c9054906101000a9004740100000000000000000000000000000000000000000274010000000000000000000000000000000000000000900403740100000000000000000000000000000000000000000290505b919050565b80151561212a57610000565b5b505600a165627a7a72305820acc85c03d355747b8033be40ce1122f444e9f760fbefea0c64e3beb76156a6310029'
      },
      'FeedAggregatorEvents100': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'LogUnset',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'LogMinimumValid',
            'type': 'event'
          }
        ],
        'bytecode': '60606040523415600b57fe5b5b60338060196000396000f30060606040525bfe00a165627a7a72305820095e54c61160aca40429588666d5c499896690abbeb8a789508b6dbdcba4d80f0029'
      },
      'FeedAggregatorInterface100': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              },
              {
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'set_minimumValid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'minimumValid',
                'type': 'bytes12'
              }
            ],
            'name': 'claim',
            'outputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'name': 'position',
                'type': 'bytes12'
              }
            ],
            'name': 'set',
            'outputs': [
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'aggregatorId',
                'type': 'bytes12'
              },
              {
                'name': 'feedId',
                'type': 'bytes12'
              }
            ],
            'name': 'unset',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': ''
      },
      'DappleEnv': {
        'interface': [
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b73509a7c442b0f8220886cfb9af1a11414680a6749600360000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600360020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073509a7c442b0f8220886cfb9af1a11414680a6749600660000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600660020160007f666565646261736500000000000000000000000000000000000000000000000060001916815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6033806101ed6000396000f30060606040525bfe00a165627a7a723058203fdc0606e4d31d0b25cb271c54aa02da601e5c6ccbff1c64e13f6cd812371e490029'
      },
      'FakePerson': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              },
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'payable': false,
            'type': 'fallback'
          }
        ],
        'bytecode': '6060604052341561000c57fe5b5b6102be8061001c6000396000f3006060604052361561004a576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634bbb216c146100ca578063cd5f5c4a14610100575b341561005257fe5b6100c85b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100c557610000565b5b565b005b34156100d257fe5b6100fe600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061015e565b005b341561010857fe5b610135600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506101a3565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a846000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b151561026b57fe5b60325a03f1151561027857fe5b50505060405180519060200180519050915091505b9150915600a165627a7a7230582092a703bf4e997f9f001e231fb0dc6e5db554b2ea4eae84174eecd448754cd49f0029'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      if(!(obj['type'].split('[')[0] in this.classes)) continue;
      this.objects[i] = this.classes[obj['type'].split('[')[0]].at(obj.value);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['feed-aggregator'];
}