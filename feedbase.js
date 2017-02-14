const Feedbase = require('./lib/feedbase.js');
const web3 = require('./web3');
const utils = require('./utils');

module.exports = (address, env) => {
  Feedbase.environments[env].feedbase.value = address;
  Feedbase.class(web3, env);
  const toString = x => web3.toAscii(x).replace(/\0/g, '');

  const feedbase = Feedbase.objects.feedbase;

  feedbase.inspect = (_id) => {
    let id = _id;
    if (id.indexOf('0x') !== -1) {
      id = id.substring(0, 26);
    } else {
      id = utils.toBytes12(id);
    }
    const owner = feedbase.owner(id);
    if (owner === '0x0000000000000000000000000000000000000000') {
      return 'Feedbase not claimed';
    }
    const result = {
      id: web3.toDecimal(id),
      owner,
      label: toString(feedbase.label(id)),
      available: feedbase.tryGet.call(id)[1],
      value: web3.toDecimal(feedbase.tryGet.call(id)[0]),
      timestamp: web3.toDecimal(feedbase.timestamp(id)),
      expiration: web3.toDecimal(feedbase.expiration(id)),
    };
    return result;
  };

  feedbase.filter = (options, callback) => {
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
  return feedbase;
};
