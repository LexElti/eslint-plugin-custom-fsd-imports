"use strict";

const path = require("path");
const micromatch = require("micromatch");
const { isPathRelative } = require("../helpers");

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "descr",
      category: "Fill me in",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const {
      alias = '',
      testFilesPatterns = []
    } = context.options[0] ?? {};

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layer = segments[0];

        if (!checkingLayers[layer]) {
          return;
        }

        // correct path should be for example 'entities/User'
        const isImportNotFromPublicApi = segments.length > 2;
        // correct path should be for example 'entities/User/testing'
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, 'Absolute imports are only allowed from Public API (index.ts)');
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some(
            pattern => micromatch.isMatch(normalizedPath, pattern)
          );

          if(!isCurrentFileTesting) {
            context.report(node, 'Test data needs to be imported from publicApi/testing.ts');
          }
        }
      }
    };
  },
};
