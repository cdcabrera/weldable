const weldable = require('../index');

describe('weldable', () => {
  it('should return specific properties', () => {
    expect(weldable).toMatchSnapshot('specific properties');
  });

  it('should attempt to create project configuration', async () => {
    const mockFunction = jest.fn();

    await weldable.weldable(
      { isStandalone: true },
      {
        cleanDist: mockFunction,
        createTsConfig: mockFunction,
        createWpConfig: mockFunction,
        standalone: mockFunction,
        startWp: mockFunction
      }
    );

    expect(mockFunction).toHaveBeenCalledTimes(1);
    mockFunction.mockClear();

    await weldable.weldable(
      { isCreateTsConfigOnly: true },
      {
        cleanDist: mockFunction,
        createTsConfig: mockFunction,
        createWpConfig: mockFunction,
        standalone: mockFunction,
        startWp: mockFunction
      }
    );

    expect(mockFunction).toHaveBeenCalledTimes(1);
    mockFunction.mockClear();

    await weldable.weldable(undefined, {
      cleanDist: mockFunction,
      createTsConfig: mockFunction,
      createWpConfig: mockFunction,
      standalone: mockFunction,
      startWp: mockFunction
    });

    expect(mockFunction).toHaveBeenCalledTimes(4);
  });
});
