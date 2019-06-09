import { canvasInit } from './initializers';

describe('canvasInit', () => {
  it('works', () => {
    const canvasSize = 10;
    const superContext = {canvasSize};
    const result = canvasInit(superContext);
    // modifies original superContext
    expect(superContext.img.sizes).toEqual([10, 10]);
    // And correctly sets result
    expect(result.img.sizes).toEqual([10, 10]);
  })
})
