module.exports = {
    "parser": "babel-eslint",
    "rules": {
        "indent": [
            2,
            2
        ],
        "quotes": [
            2,
            "single"
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-undef": 2,
        "no-unused-vars": 2
    },

    "plugins": [
      "babel"
    ],

    "env": {
        "es6": true,
        "node": true,
        "browser": true
    },
    "extends": "eslint:recommended"

};
