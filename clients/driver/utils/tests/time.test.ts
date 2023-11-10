// FILEPATH: /Users/minhthao/Documents/monorepo-taxi/clients/driver/utils/time.test.ts
import { intervalUpdate } from '../time';

jest.useFakeTimers();

describe('intervalUpdate', () => {
  let callback: jest.Mock;

  beforeEach(() => {
    callback = jest.fn();
  });

  it('should call the callback function after the specified interval', () => {
    intervalUpdate(callback, 1000);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalled();
  });

  it('should not call the callback function before the specified interval', () => {
    intervalUpdate(callback, 1000);
    jest.advanceTimersByTime(500);
    expect(callback).not.toBeCalled();
  });

  it('should stop calling the callback function after unsubscribe is called', () => {
    const unsubscribe = intervalUpdate(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalled();
    unsubscribe();
    callback.mockClear();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toBeCalled();
  });
});