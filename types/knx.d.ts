/**
 * Decode a Grieesser object from a hex string.
 * @param hex
 * @return {{sector: number|Group|string, command: {raw: number, type: string}, priority: {priority: number, type: (string|null)}}}
 */
export function decodeGriesserObject(hex: any): {
    sector: number | Group | string;
    command: {
        raw: number;
        type: string;
    };
    priority: {
        priority: number;
        type: (string | null);
    };
};
declare class Group {
    constructor(start: any, end: any, size: any);
    start: any;
    end: any;
    size: any;
}
export {};
//# sourceMappingURL=knx.d.ts.map