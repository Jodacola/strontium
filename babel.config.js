module.exports = {
  "presets": [
    ["@babel/preset-react"],
    ["@babel/preset-env",
      {
        targets: {
          esmodules: true,
        },
      }],
    ["@babel/typescript"]
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
