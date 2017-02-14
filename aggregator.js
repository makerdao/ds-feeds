const Aggregator = require('./lib/aggregator.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  Aggregator.environments[env].aggregator.value = address;
  Aggregator.class(web3, env);
  const toString = x => web3.toAscii(x).replace(/\0/g, '');

  const aggregator = Aggregator.objects.aggregator;

  aggregator.inspect = (id) => {
    const result = {
      id: web3.toDecimal(id),
      owner: aggregator.owner(id),
      label: toString(aggregator.label(id)),
      minimumValid: web3.toDecimal(aggregator.minimumValid(id)),
      available: aggregator.tryGet.call(id)[1],
      value: aggregator.tryGet.call(id)[0],
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
