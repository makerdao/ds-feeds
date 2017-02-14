const feedbase = require('./lib/feedbase.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  feedbase.environments[env].feedbase.value = address;
  feedbase.class(web3, env);
  feedbase.objects.feedbase.filter = (options, callback) => {
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
  return feedbase.objects.feedbase;
};
