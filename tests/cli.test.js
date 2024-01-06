const { execSync } = require('child_process');

describe('CLI', () => {
  it('should use default options', () => {
    const output = execSync(`node ./bin/cli.js`);
    expect(output.toString()).toMatchSnapshot('defaults');
  });

  it('should use custom options', () => {
    const output = execSync(`node ./bin/cli.js -e development -x ./webpack.custom.js -x ./webpack.other.js`);
    expect(output.toString()).toMatchSnapshot('custom');
  });
});
