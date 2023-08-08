# eslint-plugin-custom-fsd-imports

Plugin for FSD projects

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-custom-fsd-imports`:

```sh
npm install eslint-plugin-custom-fsd-imports --save-dev
```

## Usage

Add `custom-fsd-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "custom-fsd-imports"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "custom-fsd-imports/rule-name": 2
    }
}
```
