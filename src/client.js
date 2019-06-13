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

const socketErrorCallback = (serverID, err) => {
  console.error('Error on socket: ', serverID, err);
  return process.exit();
};

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

const createClientContexts = (serverConfigs, clients) =>
  Object.entries(serverConfigs).reduce(
    (accumulator, [serverID, { channels }]) =>
      Object.assign(accumulator, {
        [serverID]: {
          ...FRESH_CONTEXT,
          serverID,
          channels,
          client: clients[serverID],
          channelColours: {}
        }
      }),
    {}
  );

const sanityCheckConfig = (clientContexts, superContext) =>
  Object.keys(clientContexts).forEach(serverID => {
    if (!Object.keys(superContext.panels).includes(serverID)) {
      const err = new Error(`panels not mapped for serverID ${serverID}`);
      console.error(err);
      process.exit();
    }
    Object.entries(superContext.panels[serverID]).forEach(([, mapName]) => {
      if (!Object.keys(superContext.pixMaps).includes(mapName)) {
        const err = new Error(
          `map name ${mapName} not in superContext.pixelLists ${Object.keys(superContext.pixMaps)}`
        );
        console.error(err);
        process.exit();
      }
    });
  });

/**
 * Given a mapping of serverIDs to serverConfig , create sockets and initiate client
 */
const startClient = async () => {
  let superContext = {
    ...createSuperContext(),
    ...loadDomerc()
  };

  /**
   * A mapping of serverID to server metadata
   */
  const serverConfigs = substituteConfig(serverOptions[superContext.servers], {
    host: superContext.host
  });

  superContext = {
    ...superContext,
    ...mappingOptions[superContext.mapping]
  };

  const {
    middleware = [],
    superMiddleware = [],
    initware = [],
    mapBased = false
  } = animationOptions[superContext.animation];

  const clients = await initiateConnection(serverConfigs, socketErrorCallback);

  /**
   * The operating context for each client frame callback.
   * Modified by client frame callbacks
   */
  const clientContexts = createClientContexts(serverConfigs, clients);

  sanityCheckConfig(clientContexts, superContext);

  const pixelListsToChannelColours = () => {
    Object.keys(clientContexts).forEach(serverID => {
      Object.entries(superContext.panels[serverID]).forEach(([channel, mapName]) => {
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
    colourRateLogger(Object.values(clientContexts)[0]);

    await async.each(Object.values(clientContexts), context => {
      asyncClientFrameCallback(context);
    });
  };
  setTimeout(scheduleFunctionRecursive(clientsFrameCallback, superContext.frameRateCap), 100);
};

startClient().catch(err => console.error(err));
