const config = {
  devServer: {
    devMiddleware: {
      stats: 'errors-only',
      writeToDisk: true
    }
  }
};

export { config as default, config };
