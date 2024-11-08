const { jest } = require('@jest/globals');
const dacqui = require('../dacqui.js');

// Mock the dacqui module
jest.mock('./dacqui.js');

describe('Main Runtime Tests', () => {
  let runtime;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the mock implementation
    dacqui.mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(undefined),
      acquireSendData: jest.fn()
    }));
  });

  test('should initialize with correct transport config', () => {
    const transportConfig = {
      type: 'tcp',
      host: '127.0.0.1',
      port: '1986'
    };

    runtime = new dacqui(transportConfig);
    expect(dacqui).toHaveBeenCalledWith(transportConfig);
  });

  test('should call init() on startup', async () => {
    runtime = new dacqui({});
    await runtime.init();
    expect(runtime.init).toHaveBeenCalled();
  });

  test('should call acquireSendData periodically', () => {
    jest.useFakeTimers();
    runtime = new dacqui({});
    
    require('../main.js');
    
    jest.advanceTimersByTime(5000);
    expect(runtime.acquireSendData).toHaveBeenCalled();
    
    jest.advanceTimersByTime(5000);
    expect(runtime.acquireSendData).toHaveBeenCalledTimes(2);
    
    jest.useRealTimers();
  });

  test('should handle init failure', async () => {
    dacqui.mockImplementation(() => ({
      init: jest.fn().mockRejectedValue(new Error('Init failed')),
      acquireSendData: jest.fn()
    }));

    runtime = new dacqui({});
    await expect(runtime.init()).rejects.toThrow('Init failed');
  });
});