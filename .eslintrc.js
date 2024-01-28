const { join } = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2019,
        project: join(__dirname, "./tsconfig.json"),
        sourceType: "module"
    },
    plugins: ["rxjs"],
    overrides: [
        {
            "files": [ "src/**/*.ts" ],
            "rules": {
                "quotes": [ 2, "single" ]
            }
        }
    ],
    extends: [],
    rules: {
        "rxjs/no-async-subscribe": "error",
        "rxjs/no-ignored-observable": "error",
        "rxjs/no-nested-subscribe": "error",
        "rxjs/no-ignored-subscription": "warn",
        "rxjs/no-unbound-methods": "error",
        "rxjs/no-internal": "error",
        "rxjs/throw-error": "error",
        "rxjs/finnish": "error",
    }
};