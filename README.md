# openHAB JavaScript Tools by smartheit

This library provides utilities for the openHAB JavaScript Scripting Add-on.
It provides foundational tooling for many projects at [smartheit GmbH](https://smartheit.com/).

## Compatibility

- This library is developed for the openHAB 4.3.x series.
- It depends on `openhab` == 5.9.0, requiring manual installation on the openHAB 4.3.x series.
  Run `npm i openhab@5.9.0` inside `$OPENHAB_CONF/automation/js` to install it.
- Parts of the library require additional code that can't be shipped with the library, but this will be clearly noted then.

## Development

### Dev Environment

You need [Node.js](https://nodejs.org/), version as stated in [`.nvmrc`](.nvmrc), and npm installed.
It is required to use this version as well in your development environment, otherwise you could cause trouble.

Maintainers therefore recommend to use a Node.js version manager, e.g. [nvm-sh/nvm](https://github.com/nvm-sh/nvm).
After you've installed it, run `nvm use` to use the correct Node.js version.

openhab-js has several (development) dependencies which are required.

Run `npm install` to install those dependencies.

### Code Style

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/standard/semistandard)

[`eslint`](https://eslint.org/) is being used with the [JavaScript semistandard style](https://github.com/standard/semistandard) and some overrides for code linting and formatting.

Run the linter with:

```shell
npm run lint
```

Automatically fix issues with:

```shell
npm run lint:fix
```

### TypeScript

Although TypeScript is not used for writing the source code, it is still used for emitting declarations and thereby enabling great IntelliSense when using the library.

Generate the types with:

```shell
npm run types
```

Test the generated definitions for problems:

```shell
npm run types:test
```

### Testing

[Jest](https://jestjs.io/) is being used for unit tests, which are placed in the `test` folder and have the extension `.spec.js`.
Have a look at the [Jest Documentation](https://jestjs.io/docs/getting-started) and the existing tests to get an idea how Jest works.

### Development TL:DR;

To run the linter, generate & test type definitions, run unit tests, generate JSDoc and build the bundled file, run:

```shell
npm run build
```

## Deployment

To deploy this library to the `$OPENHAB_CONF/etc/automation/js/node_modules` folder of the openHAB server, you have two options.

### Deploy as Tarball

Pack the library as tarball:

```shell
npm pack
```

Copy the tarball to the `$OPENHAB_CONF/etc/automation/js` folder and run `npm install smartheit-openhab-tools-x.y.z.tgz`.

### Deploy as Bundle

Copy the `smartheit.js` file from the [`dist`](dist) folder into `$OPENHAB_CONF/etc/automation/js/node_modules`.


## API

### `revpi`

The `revpi` namespace provides tools related to the RevPi industrial Raspberry Pi modules.

The `setLedColor` method requires the [`revpi_leds.sh`](doc/revpi_leds.sh) script to be placed in `$OPENHAB_CONF/script`.
