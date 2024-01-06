/**
 * @module Logger
 */

/**
 * Console output colors
 *
 * @type {{RED: string, WHITE: string, BLUE: string, NOCOLOR: string, BLACK: string, MAGENTA: string,
 *     YELLOW: string, CYAN: string, GREEN: string, GREY: string}}
 */
const color = {
  BLACK: '\x1b[30m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  GREY: '\x1b[90m',
  MAGENTA: '\x1b[35m',
  NOCOLOR: '\x1b[0m',
  RED: '\x1b[31m',
  WHITE: '\x1b[37m',
  YELLOW: '\x1b[33m'
};

/**
 * Convenience wrapper for preset console messaging and colors.
 *
 * @type {{warn: (function(...[*]): void), log: (function(...[*]): void), success: (function(...[*]): void),
 *    error: (function(...[*]): void), info: (function(...[*]): void)}}
 */
const consoleMessage = (() => {
  const applyColor = (method, passedColor, ...args) =>
    console[method](`${passedColor}${args.join('\n')}${color.NOCOLOR}`);

  return {
    error: (...args) => applyColor('error', color.RED, ...args),
    success: (...args) => applyColor('log', color.GREEN, ...args),
    info: (...args) => applyColor('info', color.BLUE, ...args),
    log: (...args) => applyColor('log', color.NOCOLOR, ...args),
    warn: (...args) => applyColor('warn', color.YELLOW, ...args)
  };
})();

module.exports = { color, consoleMessage };
