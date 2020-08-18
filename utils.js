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
async function post(env, payload, service, t) {
	env = env === 'dev' ? devUrl : prodUrl;
	let endpoint = null;
	const options = {
		method: 'POST',
		uri: `${env}${service}`,
		json: payload,
		headers: {
			api_token: t,
			'Content-Type': 'application/json',
		},
	};

	return rp(options);
}

async function get(env, payload, service) {
	env = env === 'dev' ? devUrl : prodUrl;
	let endpoint = null;
	const x = Object.keys(services).filter((line) => line === service);
	const options = {
		method: 'GET',
		uri: `${env}${x}`,
		headers: {
			api_token: t,
			'Content-Type': 'application/json',
		},
	};

	return rp(options);
}

module.exports = {
	services: services,
	get: get,
	post: post,
};
