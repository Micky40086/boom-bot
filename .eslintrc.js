module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'standard',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    rules: {
        "indent": "off",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/explicit-function-return-type": ["error", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
        }],
        // "prettier/prettier": [
        //     "error",
        //     {
        //       "singleQuote": true,
        //       "semi": false
        //     }
        // ],
    }
};