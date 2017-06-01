const { getFirstGroup, getToken } = require('./utils/vk');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

function run() {
  const webServer = express();

  webServer.use('/dist', express.static(path.resolve('./dist')));
  webServer.use('/html', express.static(path.resolve('./front/html')));
  webServer.use(cookieParser());

  webServer.get('/token/', (request, response) => {
    getToken(request, response);
  });

  webServer.get('/api/firstGroupPosts', (request, response) => {
    getFirstGroup(request, response);
  });

  webServer.get('/logout', (request, response) => {
    response.clearCookie('access_token');
    response.clearCookie('user_id');
    response.redirect('/');
  });

  webServer.get(/.*/, (request, response) => {
    if (request.cookies.access_token) {
      response.redirect('/html/home.html');
    } else {
      response.redirect('/html/index.html');
    }
  });

  webServer.listen(5000, () => console.log('Сервер запущен localhost:5000'));
}

module.exports = { run };
