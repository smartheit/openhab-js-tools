/**
 * Decode a Griesser object from a hex string.
 * @param {string} hex
 * @returns {{
 *   sector: number|Group|string,
 *   sectors: number[],
 *   command: { raw: number, type: string },
 *   priority: { raw: number, type: string },
 *   data: any,
 *   raw: string,
 *   byte0: number,
 *   byte1: number,
 *   byte2: number,
 *   byte3: number,
 *   byte4: number,
 *   byte5: number,
 *   sectorCode: number,
 *   commandCode: number
 * }}
 */
export function decodeGriesserObject(hex: string): {
    sector: number | Group | string;
    sectors: number[];
    command: {
        raw: number;
        type: string;
    };
    priority: {
        raw: number;
        type: string;
    };
    data: any;
    raw: string;
    byte0: number;
    byte1: number;
    byte2: number;
    byte3: number;
    byte4: number;
    byte5: number;
    sectorCode: number;
    commandCode: number;
};
declare class Group {
    constructor(start: any, end: any, size: any);
    start: any;
    end: any;
    size: any;
}
export {};
//# sourceMappingURL=knx.d.ts.map