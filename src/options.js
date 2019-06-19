import { options } from 'yargs';
import { mapValues } from 'lodash';
import { opcPort } from '@js-telecortex-2/js-telecortex-2-util';
import { singleRainbow, rainbowFlow, justBlack, coloursToAllChannels } from './drivers/middleware';
import {
  basicRainbows,
  interpolateImg,
  maybeShowPreview,
  readCapture,
  applyDirect,
  basicText
} from './drivers/superMiddleware';
import { directRainbows, directSimplexRainbows } from './graphics';
import { canvasInit, previewInit, videoInit } from './drivers/initializers';
import {
  MAPS_DOME_OVERHEAD,
  PANELS_DOME_OVERHEAD,
  MAPS_DOME_SIMPLIFIED,
  MAPS_SQUARE_SERP_9,
  PANELS_SQUARE_SERP_9,
  MAPS_SQUARE_SERP_12,
  PANELS_SQUARE_SERP_12,
  PANELS_ONE_BIG_TRIANGLE,
  PANELS_DOME_SIMPLIFIED,
  PANELS_ONE_SMOL_TRIANGLE,
  PANELS_DOME_SIMPLIFIED_SINGULAR
} from './mapping';

export const animationOptions = {
  singleRainbow: {
    middleware: [singleRainbow, coloursToAllChannels]
  },
  rainbowFlow: {
    middleware: [rainbowFlow, coloursToAllChannels]
  },
  justBlack: {
    middleware: [justBlack, coloursToAllChannels]
  },
  directRainbows: {
    superMiddleware: [applyDirect(directRainbows)],
    mapBased: true
  },
  directSimplexRainbows: {
    superMiddleware: [applyDirect(directSimplexRainbows)],
    mapBased: true
  },
  basicText: {
    initware: [canvasInit],
    superMiddleware: [
      basicText({ r: 128, g: 128, b: 128 }, true),
      interpolateImg,
      maybeShowPreview
    ],
    mapBased: true
  },
  rainbowText: {
    initware: [canvasInit],
    superMiddleware: [
      basicRainbows,
      basicText({ r: 0, g: 0, b: 0 }),
      interpolateImg,
      maybeShowPreview
    ],
    mapBased: true
  },
  basicRainbows: {
    initware: [canvasInit],
    superMiddleware: [basicRainbows, interpolateImg, maybeShowPreview],
    mapBased: true
  },
  video: {
    initware: [canvasInit, previewInit, videoInit],
    superMiddleware: [readCapture, interpolateImg, maybeShowPreview],
    mapBased: true
  }
};

export const serverOptions = {
  five: {
    0: { host: 'telecortex-00.local', opcPort },
    1: { host: 'telecortex-01.local', opcPort },
    2: { host: 'telecortex-02.local', opcPort },
    3: { host: 'telecortex-03.local', opcPort },
    4: { host: 'telecortex-04.local', opcPort }
  },
  four: {
    0: { host: 'telecortex-00.local', opcPort },
    1: { host: 'telecortex-01.local', opcPort },
    2: { host: 'telecortex-02.local', opcPort },
    4: { host: 'telecortex-04.local', opcPort }
  },
  'one-raspberrypi': {
    4: { host: 'raspberrypi.local', opcPort }
  },
  'one-balenapi': {
    4: { host: '192.168.1.120', opcPort }
  },
  'one-host': {
    4: { host: '[host]', opcPort }
  },
  'one-localhost': {
    4: { host: 'localhost', opcPort }
  }
};

export const mappingOptions = {
  square_serp_12: {
    pixMaps: MAPS_SQUARE_SERP_12,
    panels: PANELS_SQUARE_SERP_12
  },
  square_serp_9: {
    pixMaps: MAPS_SQUARE_SERP_9,
    panels: PANELS_SQUARE_SERP_9
  },
  dome_overhead: {
    pixMaps: MAPS_DOME_OVERHEAD,
    panels: PANELS_DOME_OVERHEAD
  },
  one_big_triangle: {
    pixMaps: MAPS_DOME_SIMPLIFIED,
    panels: PANELS_ONE_BIG_TRIANGLE
  },
  one_smol_triangle: {
    pixMaps: MAPS_DOME_SIMPLIFIED,
    panels: PANELS_ONE_SMOL_TRIANGLE
  },
  simplified: {
    pixMaps: MAPS_DOME_SIMPLIFIED,
    panels: PANELS_DOME_SIMPLIFIED
  },
  simplified_singular: {
    pixMaps: MAPS_DOME_SIMPLIFIED,
    panels: PANELS_DOME_SIMPLIFIED_SINGULAR
  }
};

export const defaultConfig = {
  animation: 'directSimplexRainbows',
  servers: 'five',
  mapping: 'dome_overhead',
  frameRateCap: Infinity,
  canvasSize: 512,
  text: 'MOONBASE',
  host: 'localhost'
};

export const clientArgs = defaults =>
  options(
    Object.assign(
      {
        animation: {
          alias: 'a',
          describe: 'Pick which animation is displayed',
          choices: Object.keys(animationOptions),
          default: 'directSimplexRainbows'
        },
        servers: {
          alias: 's',
          describe: 'Pick which servers are used',
          choices: Object.keys(serverOptions),
          default: 'five'
        },
        mapping: {
          alias: 'm',
          describe: 'Pick which mapping is used',
          choices: Object.keys(mappingOptions),
          default: 'dome_overhead'
        },
        videoFile: {
          describe: 'Pick the video used in the video animation'
        },
        enablePreview: {
          alias: 'p',
          type: 'boolean'
        },
        frameRateCap: {
          alias: 'f',
          type: 'number',
          default: Infinity
        },
        canvasSize: {
          alias: 'c',
          type: 'number',
          default: 512
        },
        text: {
          alias: 't',
          type: 'string',
          default: 'MOONBASE'
        },
        host: {
          alias: 'h',
          type: 'string',
          default: 'localhost',
          describe: 'the host to use in one-host server config'
        }
      },
      mapValues(defaults, val => ({ default: val }))
    )
  ).argv;
