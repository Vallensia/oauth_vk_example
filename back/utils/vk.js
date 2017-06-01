const
  axios = require('axios');

const { CLIENT_ID, CLIENT_SECRETS } = require('../constants/client');

function getFirstGroup(request, response) {
  const { access_token, user_id } = request.cookies;

  axios({
    url: 'https://api.vk.com/method/groups.get',
    params: {
      user_id,
      access_token,
      count: 1,
    },
  }).then((groupsResponse) => {
    const groupId = groupsResponse.data.response[1];
    return axios({
      url: 'https://api.vk.com/method/wall.get',
      params: {
        owner_id: `-${groupId}`,
        count: 5,
        extended: 1,
        fields: 'name',
      },
    });
  }).then((postsResponse) => {
    response.json(postsResponse.data.response);
  }).catch((error) => {
    response.sendStatus(500);
  });
}

function getToken(request, response) {
  const { code } = request.query;

  if (!code) {
    response.redirect('/');
  }

  axios({
    url: 'https://oauth.vk.com/access_token',
    params: {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRETS,
      redirect_uri: 'http://localhost:5000/token/',
    },
  }).then((tokenResponse) => {
    const { access_token, expires_in, user_id } = tokenResponse.data;

    const options = {
      maxAge: expires_in * 1000,
    };

    response.cookie('access_token', access_token, options);
    response.cookie('user_id', user_id, options);

    response.redirect('/posts');
  }).catch((error) => {
    response.redirect('/');
  });
}

module.exports = {
  getFirstGroup,
  getToken,
};
