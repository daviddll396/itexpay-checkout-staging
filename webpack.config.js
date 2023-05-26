const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, 'src/assets/'),
      "@pages": path.resolve(__dirname, 'src/pages/'),
      "@components":path.resolve(__dirname, 'src/components/')
    },
  },
};