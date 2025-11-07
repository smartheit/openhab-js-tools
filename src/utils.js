/**
 * Utils namespace
 *
 * This namespace provides utility functions.
 * @namespace utils
 */

/**
 * Converts a BigInt to string by interpreting each byte as a character.
 *
 * @memberOf utils
 * @param {BigInt} value the BigInt value to convert
 * @return {string} the resulting string
 */
function interpretBigIntAsString (value) {
  if (typeof value !== 'bigint') {
    throw new TypeError('Input must be a BigInt');
  }

  let txt = '';

  // Extract 8 bytes (most significant first)
  for (let i = 7; i >= 0; i--) {
    // Shift and mask one byte
    const byte = Number((value >> BigInt(i * 8)) & 0xFFn);

    // Convert byte to a character
    txt += String.fromCharCode(byte);
  }

  return txt;
}

module.exports = {
  interpretBigIntAsString
};
