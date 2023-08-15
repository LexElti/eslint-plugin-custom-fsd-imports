const path = require('path');

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const normalizedCurrentPath = normalizedPath?.split('src')[1];
  return normalizedCurrentPath?.split('\\').join('/') ?? '';
}

module.exports = {
  isPathRelative,
  getNormalizedCurrentFilePath
}
