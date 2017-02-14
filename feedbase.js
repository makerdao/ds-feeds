const Feedbase = require("./lib/feedbase.js");
Feedbase.environments.ropsten.feedbase.value = '0x929be46495338d84ec78e6894eeaec136c21ab7b';
feedbase = new Feedbase.class(web3, 'ropsten').objects.feedbase;
feedbase.c = () => {
  this.c({ from: web3.eth.coinbase },function(e,r) { console.log(r) });
}
module.exports = feedbase;
