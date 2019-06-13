import { composeOPCMessage } from '@js-telecortex-2/js-telecortex-2-util';

/**
 * Given a context containing a mapping of channel numbers to colours, send data over OPC
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

