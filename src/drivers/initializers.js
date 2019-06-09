import cv from 'opencv4nodejs';
import { getSquareCanvas, setupMainWindow, showPreview } from '../graphics';

/**
 * Initializer used for animations which involve canvases
 * @param {Object} superContext
 */
export const canvasInit = superContext => Object.assign(superContext, {
  img: getSquareCanvas(superContext.canvasSize)
});

export const previewInit = superContext => {
  setupMainWindow(superContext.img);
  showPreview(superContext.img, superContext.pixMaps);
  return superContext;
};

export const videoInit = superContext => Object.assign(superContext, {
  cap: new cv.VideoCapture(superContext.videoFile),
  img: superContext.cap.read()
});
