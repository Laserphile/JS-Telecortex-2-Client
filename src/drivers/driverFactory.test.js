import { difference } from 'lodash';
import { driverFactory, opcClientDriver } from './driverFactory';
import { coloursToAllChannels, coloursToChannels, rainbowFlow, singleRainbow } from './middleware';
import { mockMultiChannel, mockSingleChannel, mockSpi } from '../testing';

const mockSpi0 = mockSpi(jest.fn());
const mockSpi1 = mockSpi(jest.fn());
const mockSpi2 = mockSpi(jest.fn());
const mockSpi3 = mockSpi(jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

const oldError = console.error;
console.error = jest.fn();

afterAll(() => {
  jest.resetAllMocks();
  console.error = oldError;
});

const channelColours = { 0: [{ r: 1, g: 2, b: 3 }] };

describe('opcClientDriver', () => {
  const mockClient = { write: jest.fn() };
  it('writes data to OPC Server socket', () => {
    const rainbowFlowLoop = driverFactory(
      {
        client: mockClient,
        channelColours,
        channels: mockMultiChannel(mockSpi0, mockSpi1, mockSpi2, mockSpi3)
      },
      [rainbowFlow, coloursToChannels([2])],
      opcClientDriver
    );
    rainbowFlowLoop();
    expect(mockClient.write.mock.calls.length).toBe(1);
    expect(mockClient.write.mock.calls.length).toMatchInlineSnapshot(`1`);
  });
});
