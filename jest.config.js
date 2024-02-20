module.exports = {
    "moduleFileExtensions": [
        "js",
        "jsx",
        "ts",
        "tsx"
    ],
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    "modulePaths": [
        "<rootDir>/node_modules",
        "<rootDir>/lib"
    ],
    "testMatch": [
        "<rootDir>/spec/**/*.(js|ts|tsx)"
    ],
    "testPathIgnorePatterns": [
        "<rootDir>/spec/test_util"
    ],
    "verbose": true,
    "testEnvironmentOptions": {
        "url": "http://www.roadtonowhere.com/path1/path2/?id=someId&key1=value1&key2=value2&encodedKey=Some%20Encoded%20Valu%C3%A9%3F"
    },
    "globals": {
        "babel-jest": {
            "useBabelrc": true
        },
        "ts-jest": {
            "useBabelrc": true,
            "tsConfigFile": "tsconfig.json"
        }
    },
    "collectCoverageFrom": [
        "lib/**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ]
}