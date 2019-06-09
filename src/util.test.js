import { substituteString, substituteConfig } from './util'

describe('substituteString', () => {
  it('works', () => {
    expect(substituteString('[foo]', { foo: 'bar' })).toEqual('bar')
    expect(substituteString(' [foo] [bar] ', { foo: 'baz', bar: 'quux' })).toEqual(' baz quux ')
  });
});

describe('substituteConfig', () => {
  it('works', () => {
    expect(substituteConfig([{ 'foo': '[bar] [quux]', baz: 1 }], { bar: 'baz' })).toEqual([{ foo: 'baz [quux]', baz: 1 }])
  });
});
