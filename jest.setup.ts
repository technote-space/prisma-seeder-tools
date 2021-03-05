jest.mock('./src/constant', () => Object.assign(jest.requireActual('./src/constant'), {
  INTERVAL_MS: 0,
}));
