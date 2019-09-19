import { flow } from 'lodash';
import async from 'async';
import {
  CLIENT_CONF,
  colourRateLogger,
  FRESH_CONTEXT
} from '@js-telecortex-2/js-telecortex-2-util';
import { opcClientDriver } from './drivers/driverFactory';
import { animationOptions, mappingOptions, serverOptions } from './options';
import { loadDomerc, scheduleFunctionRecursive, substituteConfig } from './util';
import { initiateConnection } from './connection';

/**
 * TODO allow for swapping out drivers using config/yargs
 * Context shared across all clients
 */
const createSuperContext = () => ({
  ...CLIENT_CONF,
  frameNumber: 0,
  driver: opcClientDriver,
  // driver: identity
  pixelLists: {}
});

/**
 * Given a mapping of serverIDs to serverConfig , create sockets and initiate client
 */
const startClients = async () => {
  const superContext = createSuperContext();

  loadDomerc(superContext);

  /**
   * A mapping of serverID to server metadata
   */
  const serverConfigs = substituteConfig(serverOptions[superContext.servers], {
    host: superContext.host
  });

  Object.assign(superContext, mappingOptions[superContext.mapping]);

  const {
    middleware = [],
    superMiddleware = [],
    initware = [],
    mapBased = false
  } = animationOptions[superContext.animation];

  const socketErrorCallback = (serverID, err) => {
    console.error('Error on socket: ', serverID, err);
    return process.exit();
  };

  await initiateConnection(serverConfigs, socketErrorCallback);

  /**
   * The operating context for each client frame callback.
   * Modified by client frame callbacks
   */
  const clientContexts = Object.entries(serverConfigs).reduce(
    (accumulator, [serverID, { client, channels }]) =>
      Object.assign(accumulator, {
        [serverID]: {
          ...FRESH_CONTEXT,
          serverID,
          channels,
          client,
          channelColours: {}
        }
      }),
    {}
  );

  const pixelListsToChannelColours = (clientContexts, superContext) => {
    Object.keys(clientContexts).forEach(serverID => {
      if (!Object.keys(superContext.panels).includes(serverID)) {
        const err = new Error(`panels not mapped for serverID ${serverID}`);
        console.error(err);
        process.exit();
      }
      Object.entries(superContext.panels[serverID]).forEach(([channel, mapName]) => {
        if (!Object.keys(superContext.pixelLists).includes(mapName)) {
          const err = new Error(
            `map name ${mapName} not in superContext.pixelLists ${Object.keys(
              superContext.pixelLists
            )}`
          );
          console.error(err);
          // process.exit();
        }
        clientContexts[serverID].channelColours[channel] = superContext.pixelLists[mapName];
      });
    });
  };

  /**
   * async callback which sends the OPC data for a single frame on a single client
   */
  const asyncClientFrameCallback = async.compose(
    ...[...middleware, superContext.driver].reverse().map(async.asyncify)
  );

  flow(...initware)(superContext);

  // Awaits a complete frame to be generated and sent to all servers
  const clientsFrameCallback = async () => {
    superContext.frameNumber += 1;

    flow(...superMiddleware)(superContext);

    if (mapBased) {
      pixelListsToChannelColours(clientContexts, superContext);
    }

    // only call colourRateLogger on the first context
    colourRateLogger(Object.values(clientContexts)[0] || {});

    await async.each(Object.values(clientContexts), context => {
      asyncClientFrameCallback(context);
    });
  };

  setTimeout(scheduleFunctionRecursive(clientsFrameCallback, superContext.frameRateCap), 100);
};

startClients();
