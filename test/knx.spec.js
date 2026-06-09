const { decodeGriesserObject } = require('../src/knx');

describe('knx', () => {
  describe('decodeGriesserObject', () => {
    test('decodes a valid hex string correctly (standard individual sector)', () => {
      const hex = '47 04 63 04 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(36);
      expect(result.command.raw).toBe(1);
      expect(result.command.type).toBe('drive command');
      expect(result.priority).toBeNull();
      expect(result.byte0).toBe(0x47);
      expect(result.byte1).toBe(0x04);
      expect(result.byte2).toBe(0x63);
      expect(result.byte3).toBe(0x04);
      expect(result.byte4).toBe(0x00);
      expect(result.byte5).toBe(0x00);
      expect(result.sectorCode).toBe(71);
      expect(result.commandCode).toBe(1);
      expect(result.sectors).toEqual([36]);
      expect(result.data).toBe('fixed position P4 approach');
      expect(result.raw).toBe(hex);
    });

    test('decodes a valid hex string correctly (drive command with fallback data)', () => {
      const hex = '07 04 65 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(4);
      expect(result.command.raw).toBe(1);
      expect(result.command.type).toBe('drive command');
      expect(result.priority).toBeNull();
      expect(result.sectorCode).toBe(7);
      expect(result.commandCode).toBe(1);
      expect(result.sectors).toEqual([4]);
      expect(result.data).toBe('Unknown drive command 5');
      expect(result.raw).toBe(hex);
    });

    test('decodes 10-bit sectors (>255) and operation code command', () => {
      const hex = '01 16 82 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(257);
      expect(result.sectorCode).toBe(513);
      expect(result.sectors).toEqual([257]);
      expect(result.commandCode).toBe(5);
      expect(result.command.type).toBe('operation code');
      expect(result.priority).toBeNull();
      expect(result.data).toEqual(['localoperation', 'short up']);
    });

    test('decodes priority override strings when commandCode is 0', () => {
      const hex = '05 00 60 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(3);
      expect(result.sectorCode).toBe(5);
      expect(result.sectors).toEqual([3]);
      expect(result.commandCode).toBe(0);
      expect(result.command.type).toBe('unknown value for function: 0');
      expect(result.priority.raw).toBe(3);
      expect(result.priority.type).toBe('priority command');
      expect(result.data).toBe('unknown value for command: 0');
    });

    test('decodes group sectors correctly', () => {
      const hex = '0C 00 00 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sectorCode).toBe(12);
      expect(result.sectors).toEqual([5, 6, 7, 8]);
      expect(result.sector.start).toBe(4);
      expect(result.sector.end).toBe(8);
      expect(result.sector.size).toBe(4);
      expect(result.priority.raw).toBe(0);
      expect(result.priority.type).toBe('border command');
    });

    describe('decodes examples from official Griesser GPA ETS App logs', () => {
      test('ID 1: 3F 15 81 00 00 00', () => {
        const result = decodeGriesserObject('3F 15 81 00 00 00');
        expect(result.sectors).toEqual([160]);
        expect(result.command.type).toBe('operation code');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual(['localoperation', 'long down']);
      });

      test('ID 4: B3 04 03 02 00 00', () => {
        const result = decodeGriesserObject('B3 04 03 02 00 00');
        expect(result.sectors).toEqual([90]);
        expect(result.command.type).toBe('drive command');
        expect(result.priority).toBeNull();
        expect(result.data).toBe('fixed position P2 approach');
      });

      test('ID 11: 20 59 00 FF 00 FF', () => {
        const result = decodeGriesserObject('20 59 00 FF 00 FF');
        expect(result.sectorCode).toBe(288);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(129);
        expect(result.sectors[31]).toBe(160);
        expect(result.command.type).toBe('driving range limits for automatic drive commands');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual([
          'min. angle: 0',
          'max. angle: 255',
          'min. height: 0',
          'max. height: 255'
        ]);
      });

      test('ID 39: 20 11 01 00 00 00', () => {
        const result = decodeGriesserObject('20 11 01 00 00 00');
        expect(result.sectorCode).toBe(288);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(129);
        expect(result.sectors[31]).toBe(160);
        expect(result.command.type).toBe('set/delete lock');
        expect(result.priority).toBeNull();
        expect(result.data).toBe('driving command');
      });

      test('ID 42: 60 4D 00 FF 00 FF', () => {
        const result = decodeGriesserObject('60 4D 00 FF 00 FF');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('driving range limits for safety drive commands');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual([
          'min. angle: 0',
          'max. angle: 255',
          'min. height: 0',
          'max. height: 255'
        ]);
      });

      test('ID 44: 60 2D 00 00 00 00', () => {
        const result = decodeGriesserObject('60 2D 00 00 00 00');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('bus monitoring');
        expect(result.priority).toBeNull();
        expect(result.data).toBe('bus monitoring Off');
      });

      test('ID 45: 60 09 00 14 00 00', () => {
        const result = decodeGriesserObject('60 09 00 14 00 00');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('value correction');
        expect(result.priority).toBeNull();
        expect(result.data).toBe('value correction, absolute position 100 %');
      });
    });

    test('handles invalid hex strings gracefully', () => {
      const badHexes = ['GHIJKL', '12345', '', null, undefined];
      for (const hex of badHexes) {
        expect(() => decodeGriesserObject(hex)).toThrow();
      }
    });
  });
});
