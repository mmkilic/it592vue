publicPath: process.env.NODE_ENV === 'production'
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/it592vue/' : '/'
};
