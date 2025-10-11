const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    host: '0.0.0.0', // Yerel ağda erişim için
    port: 8080, // Kullanmak istediğiniz port numarası
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    open: true,
  },
};
