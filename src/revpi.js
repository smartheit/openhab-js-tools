/**
 * RevPI namespace
 *
 * This namespace provides tools related to the RevPi industrial Raspberry Pi modules.
 * @namespace revpi
 */

const { actions } = require('openhab');

/**
 * @type {Object}
 * @memberOf revpi
 * @property {string} RED red color
 * @property {string} GREEN green color
 * @property {string} OFF no color - LED off
 */
const RevPiLedColor = {
  RED: 'red',
  GREEN: 'green',
  OFF: 'off'
};

/**
 * Sets the color of a RevPi LED by calling the `revpi_leds.sh` script.
 *
 * @memberOf revpi
 * @param {string} script the path to the `revpi_leds.sh` script
 * @param {string} led the name of the LED, e.g. `a1` or `a2`
 * @param {string} color the color to set the LED to, use {@link RevPiLedColor} constants
 */
function setLedColor (script, led, color) {
  let greenValue, redValue;
  switch (color) {
    case RevPiLedColor.RED:
      greenValue = 0;
      redValue = 255;
      break;
    case RevPiLedColor.GREEN:
      greenValue = 255;
      redValue = 0;
      break;
    case RevPiLedColor.OFF:
      greenValue = 0;
      redValue = 0;
      break;
  }

  actions.Exec.executeCommandLine(script, led + '_green', greenValue.toString());
  actions.Exec.executeCommandLine(script, led + '_red', redValue.toString());
}

module.exports = {
  RevPiLedColor,
  setLedColor
};
