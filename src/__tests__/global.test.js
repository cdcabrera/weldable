const global = require('../global');

describe('Global', () => {
  it('should return specific properties', () => {
    expect(global).toMatchSnapshot('specific properties');
  });

  it('should handle errors in multiple formats', () => {
    const errorLikeStr = 'Custom error string';
    const errorObj = new Error('Custom error object');
    const errorLikeObj = { one: errorLikeStr, two: errorObj };
    const errorList = [errorLikeStr, errorObj, errorLikeObj];

    expect(global.errorMessageHandler(errorLikeStr)).toMatchSnapshot('errorLikeStr');
    expect(global.errorMessageHandler(errorObj)).toMatchSnapshot('errorObj');
    expect(global.errorMessageHandler(errorLikeObj)).toMatchSnapshot('errorLikeObj');
    expect(global.errorMessageHandler(errorList)).toMatchSnapshot('errorList');
  });

  it('should determine a promise', () => {
    expect(global.isPromise(Promise.resolve())).toBe(true);
    expect(global.isPromise(async () => {})).toBe(true);
    expect(global.isPromise(() => 'lorem')).toBe(false);
  });

  it('should create a file from a string', () => {
    const { contents, dir, file } = global.createFile('lorem ipsum', {
      dir: './.fixtures'
    });
    expect({ contents, dir, file }).toMatchSnapshot('createFile');
    removeFixture(file);
  });

  it('should set a one-time mutable OPTIONS object', () => {
    const { OPTIONS } = global;
    OPTIONS.lorem = 'et all';
    OPTIONS.dolor = 'magna';
    OPTIONS._set = {
      lorem: 'ipsum',
      sit: function () {
        return `function test ${this.contextPath}`;
      }
    };
    OPTIONS.lorem = 'hello world';
    OPTIONS.dolor = 'sit';

    expect({ isFrozen: Object.isFrozen(OPTIONS), OPTIONS }).toMatchSnapshot('immutable');
  });
});
