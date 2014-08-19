'use strict';

var dimensions = require('image-size');

var MAX_IMAGE_SIZE = 2 * 1024 * 1024;

var errors = {};
var warnings = {};

var ManifestIcon = function () {
  this.maxFileSize = MAX_IMAGE_SIZE;

  var self = this;

  var validateSize = function () {
    if (self.buffer instanceof Buffer) {
      var bufferSize = self.buffer.length;

      if (bufferSize > self.maxFileSize) {
        errors.IconSizeTooLarge = 'Filesize is greater than ' +
          Math.floor(self.maxFileSize / 1024 / 1024) + 'MB';
      }
    } else {
      errors.InvalidIconFileSize = 'Cannot retrieve icon filesize';
    }
  };

  var validateSquareness = function () {
    try {
      var imageDimensions = dimensions(self.buffer);

      if (imageDimensions.width !== imageDimensions.height) {
        errors.InvalidIconSize = 'The icon must be a square';
      }
    } catch (err) {
      errors.InvalidIconDimensions = 'The dimensions could not be retrieved from ' +
        'this image'
    }
  };

  this.validate = function (buffer) {
    errors = {};
    warnings = {};

    this.buffer = buffer;

    validateSize();
    validateSquareness();

    return {
      errors: errors,
      warnings: warnings
    }
  };
};

module.exports = ManifestIcon;
