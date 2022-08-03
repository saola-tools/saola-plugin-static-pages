module.exports = {
  plugins: {
    appStaticPages: {
      contextPath: '/homepage',
      homepageUrl: '/index'
    },
    appWebweaver: {
      defaultRedirectUrl: '/index'
    }
  }
};
