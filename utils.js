const httpCheckRegexp = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

module.exports.isSet = (obj) => {
  return !!(obj && obj !== null && (typeof obj === 'string' && obj !== ""));
};

module.exports.validateUrl = (url) => {
  return httpCheckRegexp.test(url);
};