import { msNow } from '@js-telecortex-2/js-telecortex-2-util';
import { readFileSync } from 'fs';
import { merge } from 'lodash';
import { clientArgs, defaultConfig } from './options';

/**
 * Performs substitutions on all strings in a nested config object
 * @param {object} config
 * @param {object} substitutions
 */
export const substituteConfig = (config, substitutions) => {
  let stringConfig = JSON.stringify(config);
  Object.entries(substitutions).forEach(([key, value]) => {
    stringConfig = stringConfig.replace(`[${key}]`, value);
  });
  return merge(config, JSON.parse(stringConfig));
};

/**
 * TODO: refactor using limiter https://www.npmjs.com/package/limiter
 * Alternatively, accept an idle() function which can ask the controller what its' queue status is like
 * Recursively schedules a function so that it is called at most rateCap times per second
 * @param {function} func
 * @param {number} rateCap
 */
export const scheduleFunctionRecursive = (func, rateCap) => {
  const maxTimeMs = 1000.0 / rateCap;
  return () => {
    const startTimeMs = msNow();
    func();
    const deltaTimeMs = msNow() - startTimeMs;
    setTimeout(scheduleFunctionRecursive(func, rateCap), Math.max(0, maxTimeMs - deltaTimeMs));
  };
};

export const loadDomerc = superContext => {
  try {
    const domeConfig = JSON.parse(readFileSync('.domerc.json', 'utf8'));
    Object.assign(superContext, domeConfig, clientArgs(Object.assign(defaultConfig, domeConfig)));
  } catch (e) {
    Object.assign(superContext, clientArgs(defaultConfig));
  }
};
