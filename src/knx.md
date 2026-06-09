# KNX

## Griesser Object

The Griesser Object is a proprietary 6-byte data structure used by the Swiss company [Griesser](https://www.griesser.ch/de/produkte/steuerungen/haus-und-gebaeudeautomation/knx).
It is used by their sun protection systems, which include components such as the EMX-8 weather station and the JAX actuators.

This documentation on decoding implementation in [knx.js](file:///home/florianh/gitrepos/smartheit-js-tools/src/knx.js),
which is based on [croghostrider/node-red-contrib-knx-ultimate:KNXEngine/dptlib/dpt60001.js](https://github.com/croghostrider/node-red-contrib-knx-ultimate/blob/25ec8c82c7172bd9650c4ab3d37980f296d2a3eb/KNXEngine/dptlib/dpt60001.js) as a reference implementation.

### Data Structure Overview

| Byte | Description                                           |
|------|-------------------------------------------------------|
| 0    | Sector / Address (bits 0–7 of the 10-bit Sector Code) |
| 1    | Command (bits 2–7) & Sector / Address MSB (bits 0–1)  |
| 2    | Parameter 1 / Priority (only if Command Code is `0`)  |
| 3    | Parameter 2                                           |
| 4    | Parameter 3                                           |
| 5    | Parameter 4                                           |

---

### Sector / Address Decoding

The Sector / Address code is a 10-bit value calculated from Byte 0 and Byte 1:

$$\text{Sector Code} = \text{Byte 0} + (\text{Byte 1} \ \&\ 3) \times 256$$

```text
Byte 0: Sector / Address (Low Bits)
|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
|-----|-----|-----|-----|-----|-----|-----|-----|
|        Sector / Address (bits 7-1)      | LSB |

Byte 1: Command & Sector / Address (High Bits)
|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
|-----|-----|-----|-----|-----|-----|-----|-----|
|         Command (6 bits)          |Sec9 |Sec8 |
```

The Least Significant Bit (LSB / Bit 0 of Sector Code) controls the addressing mode:

#### 1. Individual Sector (LSB = 1)

If the Sector Code is odd, it targets a single sector. The sector number is calculated as:
$$\text{Sector Number} = (\text{Sector Code} \gg 1) + 1$$
This yields a single sector number in the range of `1` to `512`.

#### 2. Group of Sectors (LSB = 0)

If the Sector Code is even, it targets a group of sectors:
* **Group Size**: Determined by the lowest set bit in the Sector Code (i.e., $\text{Sector Code} \ \&\ -\text{Sector Code}$).
* **Base Sector**: Calculated as $\text{baseSector} = (\text{Sector Code} \gg \text{shift}) \times \text{groupSize}$, where $\text{shift}$ is the length of the binary representation of the group size.
* **Sectors Covered**: The group includes all sectors from $\text{baseSector} + 1$ to $\text{baseSector} + \text{groupSize}$ (inclusive).

*Note: A Sector Code of `0` is reserved.*

---

### Command Decoding

The command code is a 6-bit value extracted from the upper bits of Byte 1:

$$\text{Command Code} = \text{Byte 1} \gg 2$$

#### Known Commands

| Code (Decimal) | English Name                                        | Description / German Name                          |
|----------------|-----------------------------------------------------|----------------------------------------------------|
| `1`            | `drive command`                                     | Fahrbefehl                                         |
| `2`            | `value correction`                                  | Wertkorrektur                                      |
| `3`            | `automatic state`                                   | Automatik-Zustand                                  |
| `4`            | `set/delete lock`                                   | Sperre setzen/löschen                              |
| `5`            | `operation code`                                    | Bedienungscode                                     |
| `6`            | `set scene`                                         | Szene setzen                                       |
| `7`            | `special command`                                   | Sonderbefehl                                       |
| `8`            | `date`                                              | Datum                                              |
| `9`            | `sync time`                                         | Zeit synchronisieren                               |
| `10`           | `sensor reading notification`                       | Sensormeldung                                      |
| `11`           | `bus monitoring`                                    | Busüberwachung                                     |
| `16`           | `driving range limits for safety drive commands`    | Fahrbereichsbegrenzung für Sicherheits-Fahrbefehle |
| `17`           | `driving range limits for safety drive commands`    | Fahrbereichsbegrenzung für Sicherheits-Fahrbefehle |
| `19`           | `driving range limits for safety drive commands`    | Fahrbereichsbegrenzung für Sicherheits-Fahrbefehle |
| `20`           | `driving range limits for safety drive commands`    | Fahrbereichsbegrenzung für Sicherheits-Fahrbefehle |
| `22`           | `driving range limits for automatic drive commands` | Fahrbereichsbegrenzung für Automatik-Fahrbefehle   |
| `23`           | `driving range limits for automatic drive commands` | Fahrbereichsbegrenzung für Automatik-Fahrbefehle   |
| `24`           | `driving range limits for automatic drive commands` | Fahrbereichsbegrenzung für Automatik-Fahrbefehle   |

---

### Priority Decoding

Priority decoding is performed **only** when the Command Code is `0`. 

The priority command is represented by the 3 most significant bits of Byte 2:
$$\text{Priority Command} = \text{Byte 2} \gg 5$$

#### Priority Levels

| Code | English Name        | German Name       |
|------|---------------------|-------------------|
| `0`  | `border command`    | Grenzbefehl       |
| `1`  | `automatic command` | Automatikbefehl   |
| `3`  | `priority command`  | Prioritätsbefehl  |
| `4`  | `warning command`   | Warnbefehl        |
| `5`  | `security command`  | Sicherheitsbefehl |
| `6`  | `danger command`    | Gefahrenbefehl    |

---

### Command Parameters

Depending on the Command Code, the parameters in Bytes 2 to 5 are interpreted as follows:

#### Command 1: `drive command`

Interpreted based on the lower 5 bits of Byte 2 (`Byte 2 & 31`):

* `0`: `no driving movement`
* `1`: `upper end position`
* `2`: `lower end position`
* `3`: Approach fixed position. `Byte 3` specifies the fixed position index (1 to 4): `fixed position P{Byte 3} approach`.

#### Command 2: `value correction`

* If `Byte 2` is `0`, it represents an absolute position adjustment: `value correction, absolute position {Byte 3 * 5} %`.

#### Command 4: `set/delete lock`

* If `Byte 2` is `0`: `no lock`
* Otherwise, the lock type is determined by the lowest 2 bits of Byte 2 (`Byte 2 & 3`):
  * `1`: `driving command`
  * `2`: `button lock`
  * `3`: `driving command- and button lock`
* If the lock type is not matched above, the status is determined by `Byte 3`:
  * `0`: `delete lock`
  * Otherwise: `set lock`

#### Command 5: `operation code`

* **Operation Source**:
  * If `Byte 2 <= 6`: `groupoperation`
  * If `Byte 2 >= 128` and `Byte 2 <= 134`: `localoperation`
* **Sub-command**: Determined by `Byte 2 & 127`:
  * `0`: `long up`
  * `1`: `long down`
  * `2`: `short up`
  * `3`: `short down`
  * `4`: `stop`
  * `5`: `long-short up`
  * `6`: `long-short down`

#### Command 11: `bus monitoring`

* `Byte 2 === 0`: `bus monitoring Off`
* Otherwise: `bus monitoring On`

#### Commands 16, 17, 19, 20, 22, 23, 24: `driving range limits`

Returns range configuration values from all four parameters:
* `min. angle`: `Byte 2`
* `max. angle`: `Byte 3`
* `min. height`: `Byte 4`
* `max. height`: `Byte 5`
