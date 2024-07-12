const logger = require('../logger');

describe('Logger', () => {
  let consoleMockError;
  let consoleMockInfo;
  let consoleMockWarn;

  beforeEach(() => {
    consoleMockError = jest.spyOn(console, 'error');
    consoleMockInfo = jest.spyOn(console, 'info');
    consoleMockWarn = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(logger).toMatchSnapshot('specific properties');
  });

  it('should allow multiple console methods', () => {
    logger.consoleMessage.error('error message');
    expect(consoleMockError.mock.calls).toMatchSnapshot('error');

    logger.consoleMessage.info('info message');
    expect(consoleMockInfo.mock.calls).toMatchSnapshot('info');

    logger.consoleMessage.warn('warn message');
    expect(consoleMockWarn.mock.calls).toMatchSnapshot('warn');
  });
});
