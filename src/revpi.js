/**
 * RevPI namespace
 *
 * This namespace provides tools related to the RevPi industrial Raspberry Pi modules.
 * @namespace revpi
 */

const { actions, time } = require('openhab');

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
 * <p>Proper permissions on `/sys/devices/platform/leds/leds/.../brightness` must be set to allow write-access to the user running openHAB.
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

  const resultGreen = actions.Exec.executeCommandLine(time.Duration.ofSeconds(1), script, led + '_green', greenValue.toString());
  const resultRed = actions.Exec.executeCommandLine(time.Duration.ofSeconds(1), script, led + '_red', redValue.toString());
  if (resultGreen || resultRed) {
    console.error('Error setting RevPI LED color: ' + resultGreen || resultRed);
  }
}

module.exports = {
  RevPiLedColor,
  setLedColor
};
