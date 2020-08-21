const rp = require('request-promise');
const devUrl = 'https://ganglia-dev.machaao.com/';
const prodUrl = 'https://ganglia.machaao.com/';
const services = {
	annouce: 'v1/messages/announce',
	message: 'v1/messages/send',
	tag: 'v1/users/tag/',
	userProfile: 'v1/users/',
	userTags: 'v1/users/tags/',
	searchContent: 'v1/content/search/',
	searchContentViaSlug: 'v1/content/',
};
async function post(env, payload, service, t, slug) {
	env = env === 'dev' ? devUrl : prodUrl;
	const url = slug ? `${env}${service}${slug}` : `${env}${service}`;
	const options = {
		method: 'POST',
		uri: url,
		json: payload,
		headers: {
			api_token: t,
			'Content-Type': 'application/json',
		},
		transform: function (body, response) {
			if (typeof body === 'string') {
				response.body = JSON.parse(body);
				return response.body;
			} else return response.body;
		},
	};

	return rp(options);
}

async function get(env, service, slug, t) {
	env = env === 'dev' ? devUrl : prodUrl;
	const url = slug ? `${env}${service}${slug}` : `${env}${service}`;

	const options = {
		method: 'GET',
		uri: url,
		headers: {
			api_token: t,
			'Content-Type': 'application/json',
		},
		transform: function (body, response) {
			if (typeof body === 'string') {
				response.body = JSON.parse(body);
				return response.body;
			} else return response.body;
		},
	};

	return rp(options);
}

module.exports = {
	services: services,
	get: get,
	post: post,
};
