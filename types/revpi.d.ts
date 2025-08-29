/**
 * @type {Object}
 * @memberOf revpi
 * @property {string} RED red color
 * @property {string} GREEN green color
 * @property {string} OFF no color - LED off
 */
export const RevPiLedColor: any;
/**
 * Sets the color of a RevPi LED by calling the `revpi_leds.sh` script.
 *
 * @memberOf revpi
 * @param {string} script the path to the `revpi_leds.sh` script
 * @param {string} led the name of the LED, e.g. `a1` or `a2`
 * @param {string} color the color to set the LED to, use {@link RevPiLedColor} constants
 */
export function setLedColor(script: string, led: string, color: string): void;
//# sourceMappingURL=revpi.d.ts.map