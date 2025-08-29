/**
 * Creates a rule that monitors the status of a Thing and updates an Item to reflect whether the Thing is online or offline.
 *
 * <p>It supports both Number and Switch Items. For Number Items, it sets the value to 1 when the Thing is online and 0 when offline. For Switch Items, it sets the state to ON when online and OFF when offline.</p>
 *
 * @memberOf thingsx
 * @param {string} thingUID the UID of the Thing
 * @param {string} itemName the name of the Item
 */
export function createThingStatusToItemRule(thingUID: string, itemName: string): void;
//# sourceMappingURL=thingsx.d.ts.map