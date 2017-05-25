const
    express = require('express'),
    path = require('path'),
    axios = require('axios'),
    cookieParser = require('cookie-parser');

const { CLIENT_ID, CLIENT_SECRETS } = require('./constants/client');

function run() {
    const webServer = express();

    webServer.use('/js', express.static(path.resolve('./front/js')));
    webServer.use('/css', express.static(path.resolve('./front/css')));
    webServer.use(cookieParser());

    webServer.get('/token/', (request, response) => {
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
                redirect_uri: 'http://localhost:5000/token/'
            }
        }).then(tokenResponse => {
            const { access_token, expires_in, user_id } = tokenResponse.data;

            const options = {
                maxAge: expires_in * 1000
            };

            response.cookie('access_token', access_token, options);
            response.cookie('user_id', user_id, options);

            response.redirect('/groups');
        }).catch(error => {
            console.log(error);
            response.redirect('/');
        });
    });

    webServer.get('/api/firstGroupPosts', (request, response) => {
        const { access_token, user_id } = request.cookies;

        axios({
            url: 'https://api.vk.com/method/groups.get',
            params: {
                user_id,
                access_token,
                count: 1
            }
        }).then(groupsResponse => {
            const groupId = groupsResponse.data.response[1];
            return axios({
                url: 'https://api.vk.com/method/wall.get',
                params: {
                    owner_id: '-' + groupId,
                    count: 5,
                    extended: 1,
                    fields: 'name'
                }
            });
        }).then(postsResponse => {
            response.json(postsResponse.data.response);
        }).catch(error => {
            console.log(error);
            response.sendStatus(500);
        });
    });

    webServer.get('/logout', (request, response) => {
        response.clearCookie('access_token');
        response.clearCookie('user_id');
        response.redirect('/');
    });

    webServer.get(/.*/, (request, response) => {
        if (!!request.cookies.access_token) {
            response.sendFile(path.resolve('./front/groups.html'));
        } else {
            response.sendFile(path.resolve('./front/index.html'));
        }
    });

    webServer.listen(5000, () => console.log('Сервер запущен! Проверьте данные в /back/constants/client'));
}

module.exports = { run };