// webpack.config.js
const path = require('path');

module.exports = {
  entry: './index.js', // Replace 'index.js' with the path to your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace 'dist' with the desired output directory
    filename: 'bundle.js', // Replace 'bundle.js' with the desired output file name
  },
};
