const { decodeGriesserObject } = require('../src/knx');

describe('knx', () => {
  describe('decodeGriesserObject', () => {
    test('decodes a valid hex string correctly', () => {
      let hex = '47 04 63 04 00 00';
      let result = decodeGriesserObject(hex);
      expect(result.sector).toBe(36);
      expect(result.command.raw).toBe(1);
      expect(result.priority.priority).toBe(6);

      hex = '07 04 65 00 00 00';
      result = decodeGriesserObject(hex);
      expect(result.sector).toBe(4);
      expect(result.command.raw).toBe(1);
      expect(result.priority.priority).toBe(6);
    });


    test('handles invalid hex strings gracefully', () => {
      const badHexes = ['GHIJKL', '12345', '', null, undefined];
      for (const hex of badHexes) {
        expect(() => decodeGriesserObject(hex)).toThrow();
      }
    });
  });
});
