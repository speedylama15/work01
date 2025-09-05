const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  // IDEA: maybe I need this for main.config.js?
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
