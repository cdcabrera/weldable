/**
 * Breakout individual files for filtering.
 *
 * @param {string} files
 * @param {object} options
 * @param {string|*} options.rexp
 * @param {string} options.message
 * @returns {Array<string>}
 */
const filterFiles = (files, { rexp, message = '' } = {}) =>
  files
    .trim()
    .split(/\n/g)
    .filter(file => {
      const updatedFile = file.trim();

      if (rexp) {
        const updatedExp = (typeof rexp === 'string' && new RegExp(rexp)) || rexp;
        return updatedFile.length > 0 && updatedExp.test(updatedFile);
      }

      return updatedFile.length > 0;
    })
    .map(file => `File > ${file} > is modified.${(message && ` ${message}`) || ''}`);

/**
 * If modified files exist, throw an error.
 *
 * @param {string} files
 * @param {object} options
 * @param {string|*} options.rexp
 * @param {string} options.message
 * @returns {{resultsArray: Array, resultsString: string}}
 */
module.exports = (files, options) => {
  const lintResults = { resultsArray: [], resultsString: '' };

  if (files) {
    const parsedResults = filterFiles(files, options);
    lintResults.resultsArray = parsedResults;
    lintResults.resultsString = JSON.stringify(parsedResults, null, 2);
  }

  return lintResults;
};
