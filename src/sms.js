/**
 * SMS namespace
 *
 * This namespace provides tools for sending SMS messages.
 * @namespace sms
 */

const { actions } = require('openhab');

/**
 * Sends an SMS using {@link https://smsup.ch}.
 *
 * @memberOf sms
 * @param {string} token the authorization token
 * @param {string} sender identifier of the sender
 * @param {string} recipient phone number of the recipient
 * @param {string} text the text to send
 * @returns {boolean} whether the SMS was sent successfully
 */
function sendSMS (token, sender, recipient, text) {
  // See https://doc.smsup.ch/de/api/sms/versand/einzel-sms for API documentation.
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  };
  const url = `https://api.smsup.ch/send?text=${encodeURIComponent(text)}&to=${encodeURIComponent(recipient)}&sender=${encodeURIComponent(sender)}`;
  console.info(`Sending SMS from ${sender} to ${recipient}: ${text}`);
  const response = actions.HTTP.sendHttpGetRequest(url, headers, 10000);
  try {
    const result = JSON.parse(response);
    console.debug('Response from SMS service: ' + response);
    if (result.sent > 0) {
      console.info(`Successfully sent SMS from ${sender} to ${recipient}.`);
      return true;
    }
  } catch (e) {
    // ignore exception
  }
  console.info(`Failed to send SMS from ${sender} to ${recipient}!`);
  return false;
}

module.exports = {
  sendSMS
};
