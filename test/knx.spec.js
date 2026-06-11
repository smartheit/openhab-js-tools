const { decodeGriesserObject } = require('../src/knx');

describe('knx', () => {
  describe('decodeGriesserObject', () => {
    test('decodes a valid hex string correctly (standard individual sector)', () => {
      const hex = '47 04 63 04 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(36);
      expect(result.command.raw).toBe(1);
      expect(result.command.type).toBe('Fahrbefehl');
      expect(result.priority).toBeNull();
      expect(result.sectorCode).toBe(71);
      expect(result.sectors).toEqual([36]);
      expect(result.data).toEqual({ aktion: 'Fixposition Pn anfahren', position: 4 });
      expect(result.raw).toBe(hex);
    });

    test('decodes a valid hex string correctly (drive command with wippen)', () => {
      const hex = '07 04 65 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(4);
      expect(result.command.raw).toBe(1);
      expect(result.command.type).toBe('Fahrbefehl');
      expect(result.priority).toBeNull();
      expect(result.sectorCode).toBe(7);
      expect(result.sectors).toEqual([4]);
      expect(result.data).toEqual({ aktion: 'Wippen Auf', wippdauer: 0 });
      expect(result.raw).toBe(hex);
    });

    test('decodes 10-bit sectors (>255) and operation code command', () => {
      const hex = '01 16 82 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(257);
      expect(result.sectorCode).toBe(513);
      expect(result.sectors).toEqual([257]);
      expect(result.command.raw).toBe(5);
      expect(result.command.type).toBe('Bedienungs Code');
      expect(result.priority).toBeNull();
      expect(result.data).toEqual({ bedienung: 'Lokalbedienung', unterbefehl: 'Kurz auf' });
    });

    test('decodes priority override strings when commandCode is 0', () => {
      const hex = '05 00 60 00 00 00';
      const result = decodeGriesserObject(hex);
      expect(result.sector).toBe(3);
      expect(result.sectorCode).toBe(5);
      expect(result.sectors).toEqual([3]);
      expect(result.command.raw).toBe(0);
      expect(result.command.type).toBe('unbekannter Befehl: 0');
      expect(result.priority.raw).toBe(3);
      expect(result.priority.type).toBe('Prioritätsbefehl');
      expect(result.data).toEqual({ error: 'unbekannter Befehl: 0' });
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
      expect(result.priority.type).toBe('Randbefehl');
    });

    describe('decodes examples from official Griesser GPA ETS App logs', () => {
      test('ID 1: 3F 15 81 00 00 00', () => {
        const result = decodeGriesserObject('3F 15 81 00 00 00');
        expect(result.sectors).toEqual([160]);
        expect(result.command.type).toBe('Bedienungs Code');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({ bedienung: 'Lokalbedienung', unterbefehl: 'Lang ab' });
      });

      test('ID 4: B3 04 03 02 00 00', () => {
        const result = decodeGriesserObject('B3 04 03 02 00 00');
        expect(result.sectors).toEqual([90]);
        expect(result.command.type).toBe('Fahrbefehl');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({ aktion: 'Fixposition Pn anfahren', position: 2 });
      });

      test('ID 11: 20 59 00 FF 00 FF', () => {
        const result = decodeGriesserObject('20 59 00 FF 00 FF');
        expect(result.sectorCode).toBe(288);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(129);
        expect(result.sectors[31]).toBe(160);
        expect(result.command.type).toBe('Fahrbereichsgrenzen für Automatiktasterbefehle');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({
          minWinkel: 0,
          maxWinkel: 255,
          minBehanghoehe: 0,
          maxBehanghoehe: 255
        });
      });

      test('ID 39: 20 11 01 00 00 00', () => {
        const result = decodeGriesserObject('20 11 01 00 00 00');
        expect(result.sectorCode).toBe(288);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(129);
        expect(result.sectors[31]).toBe(160);
        expect(result.command.type).toBe('Sperre setzen/löschen');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({ aktion: 'Sperre löschen', targets: ['Fahrbefehlsperre'] });
      });

      test('ID 42: 60 4D 00 FF 00 FF', () => {
        const result = decodeGriesserObject('60 4D 00 FF 00 FF');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('Fahrbereichsgrenzen für Sicherheitstasterbefehle');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({
          minWinkel: 0,
          maxWinkel: 255,
          minBehanghoehe: 0,
          maxBehanghoehe: 255
        });
      });

      test('ID 44: 60 2D 00 00 00 00', () => {
        const result = decodeGriesserObject('60 2D 00 00 00 00');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('Busüberwachung');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({ aktion: 'Überwachung aus' });
      });

      test('ID 45: 60 09 00 14 00 00', () => {
        const result = decodeGriesserObject('60 09 00 14 00 00');
        expect(result.sectorCode).toBe(352);
        expect(result.sectors.length).toBe(32);
        expect(result.sectors[0]).toBe(161);
        expect(result.sectors[31]).toBe(192);
        expect(result.command.type).toBe('Wertkorrektur');
        expect(result.priority).toBeNull();
        expect(result.data).toEqual({ aktion: 'Wertkorrektur', positionAbsolutPercent: 100 });
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
