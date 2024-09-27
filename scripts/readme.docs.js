const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');

/**
 * Run jsdoc2md on files, output a README
 *
 * @param {object} params
 * @param {string} params.input
 * @param {string} params.output
 * @returns {Promise<unknown>}
 */
const generateReadMe = async ({ input, output } = {}) => {
  try {
    const outputPath = path.join(process.cwd(), output);
    const docs = await jsdoc2md.render({ files: input, 'no-gfm': true });
    fs.writeFileSync(outputPath, docs);
    console.info(`Generate README success > ${input}`);
  } catch (e) {
    console.warn(`Generate README failed > ${input} > `, e.message);
  }
};

((files = []) => {
  Promise.all(files.map(obj => generateReadMe(obj)));
})([{ input: './src/*.js', output: './src/README.md' }]);
