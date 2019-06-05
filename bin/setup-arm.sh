#!/bin/bash

copy-essential-build-artifacts () {
  rm -rdf node_modules/opencv4nodejs node_modules/opencv-build
  cp -a /essential-build-artifacts/. node_modules/
}

copy-essential-build-artifacts
