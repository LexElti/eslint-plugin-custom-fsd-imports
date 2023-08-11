"use strict";

const rule = require("../../../lib/rules/slice-imports"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

ruleTester.run("slice-imports", rule, {
  valid: [
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],
  invalid: [
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article\\ui\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Paths within a slice must be relative"}],
      options: [
        {
          alias: '@'
        }
      ],
      output: "import { addCommentFormActions, addCommentFormReducer } from '../model/slices/addCommentFormSlice'",
    },
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article\\ui\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Paths within a slice must be relative"}],
      output: "import { addCommentFormActions, addCommentFormReducer } from '../model/slices/addCommentFormSlice'",
    },
  ],
});
