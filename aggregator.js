const aggregator = require('./lib/aggregator.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  aggregator.environments[env].aggregator.value = address;
  aggregator.class(web3, env);
  return aggregator.objects.aggregator;
};
