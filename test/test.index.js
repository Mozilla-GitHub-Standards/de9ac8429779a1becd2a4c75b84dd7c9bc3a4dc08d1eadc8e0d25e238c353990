process.env.NODE_ENV = 'test';

var should = require('should');
var fs = require('fs');

var ManifestIcon = require('../index');

var iconSize = new ManifestIcon();

iconSize.maxFileSize = 0;

describe('iconSize', function () {
  it('should return with invalid dimensions from a nonexistent buffer', function () {
    var results = iconSize.validate('');
    should.exist(results.errors.InvalidIconFileSize);
    should.exist(results.errors.InvalidIconDimensions);
  });

  it('should return with invalid dimensions from a corrupted image', function () {
    var results = iconSize.validate(fs.readFileSync('test/icon-corrupt.png'));
    should.exist(results.errors.InvalidIconDimensions);
  });

  it('should return with an invalid square icon', function () {
    var results = iconSize.validate(fs.readFileSync('test/icon-rec.png'));
    should.exist(results.errors.InvalidIconSize);
  });

  it('should return with a file size that is over the limit', function () {
    var results = iconSize.validate(fs.readFileSync('test/icon.png'));
    should.exist(results.errors.IconSizeTooLarge);
  });

  it('should return with a correct file size and a square icon', function () {
    iconSize.maxFileSize = 1024 * 1024;
    var results = iconSize.validate(fs.readFileSync('test/icon.png'));
    results.errors.should.be.empty;
  });
});
