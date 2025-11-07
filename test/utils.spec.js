const { interpretBigIntAsString } = require('../src/utils');

describe('utils', () => {
  describe('interpretBigIntAsString', () => {
    test('converts an 8-byte BigInt to the correct ASCII string (ABCDEFGH)', () => {
      const value = 0x4142434445464748n; // "ABCDEFGH"
      const result = interpretBigIntAsString(value);
      expect(result).toBe('ABCDEFGH');
    });

    test('handles leading zero bytes correctly (MSB-first, padded with \0)', () => {
      const value = 0x0000000000004869n; // Leading zeros then 'H' 'i'
      const result = interpretBigIntAsString(value);
      expect(result).toBe('\0\0\0\0\0\0Hi');
      // Also verify length is always 8 characters
      expect(result).toHaveLength(8);
    });

    test('returns 8 null characters for 0n', () => {
      const result = interpretBigIntAsString(0n);
      expect(result).toBe('\0'.repeat(8));
      expect([...result].map(c => c.charCodeAt(0))).toEqual(new Array(8).fill(0));
    });

    test('converts 0xFFFFFFFFFFFFFFFFn to 8 times \u00FF (ÿ)', () => {
      const value = 0xFFFFFFFFFFFFFFFFn;
      const result = interpretBigIntAsString(value);
      expect(result).toBe('ÿ'.repeat(8));
      expect([...result].map(c => c.charCodeAt(0))).toEqual(new Array(8).fill(255));
    });

    test('throws TypeError when input is not a BigInt', () => {
      const badInputs = [123, '123', null, undefined, {}, [], () => {}];
      for (const input of badInputs) {
        expect(() => interpretBigIntAsString(input)).toThrow(TypeError);
        expect(() => interpretBigIntAsString(input)).toThrow('Input must be a BigInt');
      }
    });

    test('confirms byte order is most-significant-first', () => {
      const value = 0x0102030405060708n;
      const result = interpretBigIntAsString(value);
      const expected = String.fromCharCode(1, 2, 3, 4, 5, 6, 7, 8);
      expect(result).toBe(expected);
    });
  });
})
