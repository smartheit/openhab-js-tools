/**
 * Decode a Griesser object from a hex string.
 *
 * Decoding is based on the official _KNX Non-Standard Datapoint Type Description Form_ filed by Griesser.
 *
 * @param {string} hex
 * @returns {{
 *   sector: number|Group|string,
 *   sectors: number[],
 *   command: { raw: number, type: string },
 *   priority: { raw: number, type: string }|null,
 *   data: any,
 *   raw: string,
 *   sectorCode: number
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
    } | null;
    data: any;
    raw: string;
    sectorCode: number;
};
declare class Group {
    constructor(start: any, end: any, size: any);
    start: any;
    end: any;
    size: any;
}
export {};
//# sourceMappingURL=knx.d.ts.map