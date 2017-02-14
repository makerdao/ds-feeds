const feedbase = require('./lib/feedbase.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  feedbase.environments[env].feedbase.value = address;
  feedbase.class(web3, env);
  return feedbase.objects.feedbase;
};
