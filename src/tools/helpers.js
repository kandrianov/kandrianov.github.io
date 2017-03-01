const fs = require('fs-jetpack');
const path = require('path');

const DEV = process.env.NODE_ENV === 'development';
const PROD = process.env.NODE_ENV === 'production';
const {port} = require('../project.config.js');

module.exports.addHash = (template, hash) =>
  PROD
    ? template.replace(/\.[^.]+$/, `.[${hash}]$&`)
    : `${template}?hash=[${hash}]`;

module.exports.getEntries = (src) => {
  const entries = {};
  fs.list(src).forEach(item => {
    const resource = path.join(src, item);
    if (fs.inspect(resource).type === 'file') {
      entries[item.split('.')[0]] = [
        DEV && 'react-hot-loader/patch',
        DEV && `webpack-dev-server/client?http://localhost:${port}`,
        DEV && 'webpack/hot/only-dev-server',
        resource,
      ].filter(Boolean);
    }
  });

  return entries;
};

