import { substituteConfig } from './util';

describe('substituteConfig', () => {
  it('works', () => {
    expect(substituteConfig([{ foo: '[bar] [quux]', baz: 1 }], { bar: 'baz' })).toEqual([
      { foo: 'baz [quux]', baz: 1 }
    ]);
  });

  it('handles functions', () => {
    const bang = () => {};
    expect(substituteConfig([{ foo: '[bar] [quux]', baz: 1, bang }], { bar: 'baz' })).toEqual([
      { foo: 'baz [quux]', baz: 1, bang }
    ]);
  });
});
