import {
  mapValues
} from 'lodash';

export const substituteString = (value, substitutions) => {
  const substitutionRegexp = /\[([^\]]*)\]/;
  var substituted = '';
  while (value.length > 0) {
    const result = substitutionRegexp.exec(value);
    if (result === null) {
      return substituted + value;
    }
    substituted += value.substring(0, result.index);
    value = value.substring(result.index);
    if (Object.keys(substitutions).includes(result[1])) {
      substituted += substitutions[result[1]];
    } else {
      substituted += value.substring(0, result[0].length);
    }
    value = value.substring(result[0].length);
  }
  return substituted;
}

/**
 * Performs substitutions on all strings in a nested config object
 * @param {object} config
 * @param {object} substitutions
 */
export const substituteConfig = (config, substitutions) => {
  switch (typeof config) {
    case 'string':
      return substituteString(config, substitutions);
    case 'object':
      if (config instanceof Array) {
        return config.map(item => substituteConfig(item, substitutions));
      }
      return mapValues(config, value => {return substituteConfig(value, substitutions);});
    default:
      return config;
  }
}
