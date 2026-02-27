# KNX

## Griesser Object

The Griesser Object is a proprietary 6-byte data structure used by the Swiss company [Griesser](https://www.griesser.ch/de/produkte/steuerungen/haus-und-gebaeudeautomation/knx).
It is by their sun protection systems, which include components such as the EMX-8 weather station and the JAX actuators.

This documentation is based on a topic in the [KNX userforum](https://knx-user-forum.de/forum/%C3%B6ffentlicher-bereich/knx-eib-forum/1104719-sco-objekt-6-byte-definition).

| Byte | Description      |
|------|------------------|
| 0    | Sector / Address |
| 1    | Command          |
| 2    | P1 (Priority)    |
| 3    | P2               |
| 4    | P3               |
| 5    | P4               |

### Byte 0: Sector / Address

```text
Byte 0: Sector / Address
|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
|-----|-----|-----|-----|-----|-----|-----|-----|
|        Sector Value / Group Mask        | LSB |
```

The LSB controls the address mode:

- LSB = 1: Single Sector
- LSB = 0: Group

### Byte 1: Command

```text
Byte 1: Command
|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
|-----|-----|-----|-----|-----|-----|-----|-----|
|              Command              |  ?  |  ?  |
```

Known commands:

- 1 = Fahrbefehl

### Byte 2: P1 (Priority)

```text
|  7  |  6  |  5  |  4  |  3  |  2  |  1  |  0  |
|-----|-----|-----|-----|-----|-----|-----|-----|
|   Priority (Nibble)   | Rel | Exec|  ?  |  ?  |
```

Priorities (0=low):

- 0-1 = Grenzbefehl
- 2-3 = Automatikbefehl
- 6-7 = Prioritaetsbefehl
- 8-9 = Warnbefehl
- 10-11 = Sicherheitsbefehl
- 12-13 = Gefahrenbefehl
