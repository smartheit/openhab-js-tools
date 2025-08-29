/**
 * ThingsX namespace
 *
 * This namespace provides tools for working with Things in openHAB.
 * @namespace thingsx
 */

const { items, rules, things, triggers } = require('openhab');

/**
 * Creates a rule that monitors the status of a Thing and updates an Item to reflect whether the Thing is online or offline.
 *
 * <p>It supports both Number and Switch Items. For Number Items, it sets the value to 1 when the Thing is online and 0 when offline. For Switch Items, it sets the state to ON when online and OFF when offline.</p>
 *
 * @memberOf thingsx
 * @param {string} thingUID the UID of the Thing
 * @param {string} itemName the name of the Item
 */
function createThingStatusToItemRule (thingUID, itemName) {
  rules.JSRule({
    name: `Thing '${thingUID}' ONLINE -> Item '${itemName}'`,
    description: 'Monitors the state of a Thing and updates an Item to reflect whether the Thing is online or offline.',
    triggers: [
      triggers.SystemStartlevelTrigger('100'),
      triggers.GenericCronTrigger('0 */5 * * * ?'),
      triggers.ThingStatusUpdateTrigger(thingUID)
    ],
    execute: (event) => {
      const status = (event.triggerType === 'ThingStatusUpdateTrigger') ? event.status : things.getThing(thingUID)?.status;
      if (!status) {
        console.warn(`Failed to get status for Thing with UID '${thingUID}'.`);
        return;
      }
      const online = status === 'ONLINE';
      const item = items.getItem(itemName);
      if (item.type === 'Number') {
        item.postUpdate(online ? 1 : 0);
      } else {
        item.postUpdate(online ? 'ON' : 'OFF');
      }
    }
  });
}

module.exports = {
  createThingStatusToItemRule
};
