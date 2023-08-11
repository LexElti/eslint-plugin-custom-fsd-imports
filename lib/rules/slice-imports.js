"use strict";

const path = require('path');
const {
  isPathRelative,
  getNormalizedCurrentFilePath
} = require('../helpers');

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "Slice relative imports rule",
      category: "FSD imports",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        // https://astexplorer.net/
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // current file full path
        const fromFilename = context.getFilename();

        if (!shouldBeRelative(fromFilename, importTo)) {
          return;
        }

        context.report({
          node,
          message: 'Paths within a slice must be relative',
          fix: (fixer) => {
            const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
              .split('/')
              .slice(0, -1)
              .join('/');
            let relativePath = path.relative(normalizedPath, `/${importTo}`)
              .split('\\')
              .join('/');

            if (!relativePath.startsWith('.')) {
              relativePath = `./${relativePath}`;
            }

            return fixer.replaceText(node.source, `'${relativePath}'`);
          }
        });
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/')
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split('/');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
