"use strict";

const path = require('path');
const micromatch = require('micromatch');
const {
  isPathRelative,
  getNormalizedCurrentFilePath
} = require('../helpers');

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "Layer imports rule",
      category: "FSD imports",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          ignoreImportPatterns: {
            type: 'array',
          }
        },
      }
    ],
  },

  create(context) {
    const layers = {
      'app': ['pages', 'widgets', 'features', 'shared', 'entities'],
      'pages': ['widgets', 'features', 'shared', 'entities'],
      'widgets': ['features', 'shared', 'entities'],
      'features': ['shared', 'entities'],
      'entities': ['shared', 'entities'],
      'shared': ['shared'],
    }

    const availableLayers = {
      'app': 'app',
      'entities': 'entities',
      'features': 'features',
      'shared': 'shared',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    const {
      alias = '',
      ignoreImportPatterns = []
    } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();

      const projectPath = getNormalizedCurrentFilePath(currentFilePath);
      const segments = projectPath?.split('/')

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')

      return segments?.[0]
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (isPathRelative(importPath)) {
          return;
        }

        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        if (
          !availableLayers[importLayer] ||
          !availableLayers[currentFileLayer]
        ) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(
          pattern => micromatch.isMatch(importPath, pattern)
        );

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(
            node,
            'Layer can only import underlying layers into itself'
          );
        }
      }
    };
  },
};
