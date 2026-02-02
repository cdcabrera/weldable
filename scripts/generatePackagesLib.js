const { readFileSync, existsSync } = require('fs');
const path = require('path');
const _upperFirst = require('lodash/upperFirst');
const _camelCase = require('lodash/camelCase');
const { dependencies } = require('../package.json');
const { consoleMessage } = require('../src/logger');
const { createFile, dynamicImport } = require('../src/global');

/**
 * Generate a record of available packages.
 *
 * @param {{ [package: string]: string }} packageDependencies
 * @returns {Promise<{ [package: string]: any }>}
 */
const loadPackages = async (packageDependencies = dependencies) => {
  const keys = Object.keys(packageDependencies);
  const results = await Promise.allSettled(
    keys.map(arg => {
      return dynamicImport(arg);
    })
  );

  const packages = {};
  results.forEach((obj, index) => {
    let license;
    try {
      const licenseFile = path.resolve(__dirname, '..', 'node_modules', keys[index], 'LICENSE');
      const altLicenseTxt = path.resolve(__dirname, '..', 'node_modules', keys[index], 'LICENSE.txt');
      const altLicenseMd = path.resolve(__dirname, '..', 'node_modules', keys[index], 'LICENSE.md');

      if (existsSync(licenseFile)) {
        license = readFileSync(licenseFile, 'utf-8');
      } else if (existsSync(altLicenseTxt)) {
        license = readFileSync(altLicenseTxt, 'utf-8');
      } else if (existsSync(altLicenseMd)) {
        license = readFileSync(altLicenseMd, 'utf-8');
      }

      if (!license) {
        console.warn(
          `The package ${keys[index]} does not have a license, it will not be exported.\nConfirm the license exists.`
        );
      }
    } catch (e) {
      console.error(e.message);
    }

    if (license) {
      packages[keys[index]] = {
        license,
        package: obj
      };
    }
  });

  return packages;
};

/**
 * Write a CommonJS packages export file.
 *
 * @returns {Promise<void>}
 */
const createPackagesExport = async () => {
  const packages = await loadPackages();
  const updatedPackages = {};

  Object.entries(packages).forEach(([key, { package: packageObj, license }]) => {
    const { status, value } = packageObj;

    if (status === 'fulfilled') {
      const defaultOrValue = value?.default || value || undefined;

      const updatedKey = _camelCase(key);
      const updatedResolve = _camelCase(`${key}_Resolve`);
      const keyDefaults = {
        key,
        license,
        resolve: updatedResolve
      };

      if (defaultOrValue) {
        if (typeof defaultOrValue === 'object') {
          updatedPackages[updatedKey] = keyDefaults;
        } else {
          const isPossiblyClassButWhoReallyCares = /^class/i.test(defaultOrValue.toString());

          updatedPackages[(isPossiblyClassButWhoReallyCares && _upperFirst(updatedKey)) || updatedKey] = keyDefaults;
        }
      } else {
        consoleMessage.info(`No exported value or default found, skipping package: ${updatedKey}`);
      }
    }
  });

  // Create package js file
  const str = [];
  Object.entries(updatedPackages).forEach(([key, { key: value, resolve }]) => {
    str.push(
      `const ${resolve} = require.resolve('${value}');`,
      `exports.${resolve} = ${resolve};`,
      '',
      `const ${key} = require('${value}');`,
      `exports.${key} = ${key};`,
      ''
    );
  });

  createFile(str.join('\n'), {
    dir: path.join(__dirname, '..', 'lib'),
    filename: 'packages.js'
  });

  // Create license file
  const licenseStr = [];
  Object.entries(updatedPackages).forEach(([, { key: value, license }]) => {
    licenseStr.push(`\n${license}\n//package ${value}`);
  });

  createFile(licenseStr.join('\n\n') + '\n', {
    dir: path.join(__dirname, '..', 'lib'),
    filename: 'packagesLicenses.txt'
  });
};

/**
 * Start generating!
 */
createPackagesExport();
