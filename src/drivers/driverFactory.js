import { flow } from 'lodash';
import {
  composeOPCMessage
} from '@js-telecortex-2/js-telecortex-2-util';

/**
 * Given a context containing a mapping of channel numbers to colours, send data over OPC
 * Use this as your driver to send colours to an OPC server
 * @param {object} context
 */
export const opcClientDriver = context => {
  const { channelColours } = context;
  Object.keys(channelColours).forEach(channel => {
    const dataBuff = Buffer.from(composeOPCMessage(channel, channelColours[channel]));
    // TODO: make async version with socket.write wrapped in Promise (and pass the resolve cb into the write cb)
    context.client.write(dataBuff);
  });
  return context;
};

/**
 * Driver callback factory
 * @param { object } driverConfig is used to create a context for the
 *    middleware and driver functions.
 * @param { array } middleware is a list of functions to call before the driver
 *    function is called
 * @param driver the driver to create
 * @returns { function } callback, called repeatedly to drive the SPI.
 */
export const driverFactory = (driverConfig, middleware = [], driver = opcClientDriver) => {
  const context = { ...driverConfig };

  return () =>
    flow(
      ...middleware,
      driver
    )(context);
};

export default driverFactory;
