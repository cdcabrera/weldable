const weldable = require('../index');

describe('weldable', () => {
  it('should return specific properties', () => {
    expect(weldable).toMatchSnapshot('specific properties');
  });
});
