module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "6.11.1",
        },
      },
    ],
  ],
  ignore: ["**/vue", "**/migrations", "**/seeds", "src/customSeed.js"],
};
