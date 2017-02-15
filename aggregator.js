const Aggregator = require('./lib/aggregator.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  Aggregator.environments[env].aggregator.value = address;
  Aggregator.class(web3, env);
  const toString = x => web3.toAscii(x).replace(/\0/g, '');

  const aggregator = Aggregator.objects.aggregator;

  aggregator.inspect = (id) => {
    const owner = aggregator.owner(id);
    if (owner === '0x0000000000000000000000000000000000000000') {
      return 'Aggregator not claimed';
    }
    const result = {
      id: web3.toDecimal(id),
      owner,
      label: toString(aggregator.label(id)),
      feedsQuantity: web3.toDecimal(aggregator.feedsQuantity(id)),
      minimumValid: web3.toDecimal(aggregator.minimumValid(id)),
      value: web3.toDecimal(aggregator.tryGet.call(id)[0]),
    };
    return result;
  };

  aggregator.filter = (options, callback) => {
    web3.eth.filter(Object.assign({
      address,
    }, options), (error, event) => {
      if (error) {
        callback(error);
      } else if (!event || !event.topics) {
        callback(new Error(`Bad event: ${event}`));
      } else {
        // callback(null, web3.toDecimal(event.topics[1]));
        callback(null, event.topics[1]);
      }
    });
  };
  return aggregator;
};
