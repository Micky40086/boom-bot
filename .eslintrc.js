module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'standard',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        "indent": "off",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/explicit-function-return-type": ["error", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
        }],
    }
};