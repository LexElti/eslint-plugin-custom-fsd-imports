/**
 * @fileoverview feature sliced relative path checker
 * @author LexDev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],
  invalid: [
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Paths within a slice must be relative"}],
      options: [
        {
          alias: '@'
        }
      ]
    },
    {
      filename: 'C:\\Users\\user\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Paths within a slice must be relative"}],
    },
  ],
});
