const logger = require('../logger');

describe('Logger', () => {
  it('should return specific properties', () => {
    expect(logger).toMatchSnapshot('specific properties');
  });
});
