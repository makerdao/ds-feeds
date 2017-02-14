function toBytes12(number) {
  return toBytes(number, 12);
}

function toBytes(number, bytes) {
  let hex = web3.fromDecimal(number).replace('0x', '');
  while (hex.length < bytes * 2) hex = `0${hex}`;
  return hex;
}

function getNetwork() {
  web3.version.getNetwork((error, result) => {
    if (error) {
      return false;
    } else {
      // Private network
      const network = result > 3 ? 4 : result;
      const env = [null, 'live', 'morden', 'ropsten', 'develop'][network];
      return env;
    }
  });
}
