let jwt = require('jsonwebtoken');
const utils = require('./utils');
const bodyParser = require('body-parser');

class MessengerxSdk {
	/**
	 *Creates an instance of MessengerxSdk.
	 * @param {*} api_token The api token generated when you create a new bot in https://portal.messengerx.io
	 * @param {*} env The MessengerX environment you wish to use. Default will be dev. If your bot is published, use 'prod'
	 * @param {*} app The express server object.
	 * @memberof MessengerxSdk
	 */
	constructor(api_token, env, app) {
		this.api_token = api_token || new Error('missing api token');
		this.env = env || 'dev';
		app.use(bodyParser.json());
		app.use(
			bodyParser.urlencoded({
				extended: true,
			})
		);
	}

	//////////////////////////
	// Sending helpers
	//////////////////////////
	/**
	 *
	 *
	 * @param {*} req Express request object
	 * @param {*} messageText Text you wish to respond to user
	 * @returns
	 * @memberof MessengerxSdk
	 */
	async sendTextMessage(req, messageText) {
		const userID = this.getUserFromRequest(req);
		if (!userID || userID == null) return new Error('Invalid request!');
		var messageData = {
			users: [userID],
			message: {
				text: messageText,
			},
		};

		return utils.post(this.env, messageData, utils.services.message, this.api_token);
	}

	/**
	 *
	 *
	 * @param {*} req Express request object
	 * @param {*} messageText Text you wish to respond to user
	 * @param {*} buttons Buttons you want to display to the user. Expects an object with 3 properties: title: Display Text, type: postback | web_url, payload: text to be sent to bot.
	 * Format : {
	 * 	"title": "Hi",
	 *  "type": "postback",
	 *  "payload": "hi"
	 * }
	 * @param {*} quickReplies Quick replies you want to display to the user. Expects an object with 3 properties: title: Display Text, content_type: text, payload: text to be sent to bot.
	 * @returns
	 * @memberof MessengerxSdk
	 */
	async sendButtonsOrQuickRepliesMessage(req, messageText, buttons, quickReplies) {
		if (!req) return new Error('missing request object');
		if (!messageText) messageText = '';
		if (!buttons) buttons = [];
		if (!quickReplies) quickReplies = [];
		if (messageText === '' && buttons.length === 0 && quickReplies.length === 0)
			return new Error('cannot send empty message.');

		try {
			const userID = this.getUserFromRequest(req);
			if (!userID || userID == null) return new Error('Invalid request! Missing User.');

			let errs = [];
			//more validation
			if (buttons.length > 0) {
				buttons.map(function (l) {
					if (l.type !== 'postback' && l.type !== 'web_url') throw Error(`invalid button type: ${l.type}`);
					if (!l.title) throw Error('Missing button title');
					if (!l.payload) throw Error('Missing button payload');
				});
			}
			var messageData = {
				users: [userID],
				message: {
					text: messageText,
				},
			};
			if (buttons.length > 0) {
				messageData.message = {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'button',
							text: messageText,
							buttons: buttons,
							// elements: [
							// 	{
							// 		title: messageText,
							// 		subtitle: '',
							// 		image_url: '',
							// 		buttons: buttons,
							// 	},
							// ],
						},
					},
				};
				if (quickReplies.length > 0) messageData.message.quick_replies = quickReplies;
			} else if (quickReplies.length > 0) messageData.message.quick_replies = quickReplies;
			return utils.post(this.env, messageData, utils.services.message, this.api_token);
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
	 *
	 * @param {*} req Express request object
	 * @param {*} messageText Text you wish to respond to user
	 * @param {*} payload Array of carousel objects with format as below. Visit https://messengerx.readthedocs.io/en/latest/#get-started for more info.
	 * Format : {
	 *							title: 'Carousel Title',
	 *							subtitle: 'Carousel subtitle',
	 *							image_url: 'Carousel image url',
	 *							buttons: Array of button objects,
	 *						}
	 * @param {*} quickReplies Quick replies you want to display to the user. Expects an object with 3 properties: title: Display Text, content_type: text, payload: text to be sent to bot.
	 * @returns
	 * @memberof MessengerxSdk
	 */
	async sendCarousel(req, messageText, payload, quickReplies) {
		if (!req) return new Error('missing request object');
		if (!messageText) messageText = '';
		if (!payload.buttons) payload.buttons = [];
		if (!quickReplies) quickReplies = [];
		if (messageText === '' && payload.buttons.length === 0 && quickReplies.length === 0)
			return new Error('cannot send empty message.');

		try {
			const userID = this.getUserFromRequest(req);
			if (!userID || userID == null) return new Error('Invalid request! Missing User.');

			let errs = [];
			//more validation
			if (payload.length > 0) {
				payload.map((p) => {
					p.buttons.map(function (l) {
						if (l.type !== 'postback' && l.type !== 'web_url')
							throw Error(`invalid button type: ${l.type}`);
						if (!l.title) throw Error('Missing button title');
						if (!l.payload) throw Error('Missing button payload');
					});
				});
			}
			var messageData = {
				users: [userID],
				message: {
					text: messageText,
				},
			};
			if (payload.length > 0) {
				messageData.message = {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'generic',
							elements: [],
						},
					},
				};
				if (payload.length > 0) {
					payload.map((p) => {
						messageData.message.attachment.payload.elements.push({
							title: p.title || ' ',
							subtitle: p.subtitle || ' ',
							image_url: p.image_url || ' ',
							buttons: p.buttons,
						});
					});
				}
				if (quickReplies.length > 0) messageData.message.quick_replies = quickReplies;
			} else if (quickReplies.length > 0) messageData.message.quick_replies = quickReplies;
			return utils.post(this.env, messageData, utils.services.message, this.api_token);
		} catch (error) {
			throw error;
		}
	}

	getUserFromRequest(req) {
		if (!req) throw new Error('missing body object');

		return req.headers.user_id || new Error('missing user id. please contact administrator');
	}
	getMessagingEntries(body) {
		let self = this;
		const val = body.messaging && Array.isArray(body.messaging) && body.messaging.length > 0 && body.messaging;
		return val || null;
	}
	getUserMessages(req) {
		if (!req.body) throw new Error('missing body object');
		let body = req.body;
		let _rawBody = req.body && req.body.raw;
		let userID = this.getUserFromRequest(req);
		let that = this;
		if (!_rawBody || !userID)
			throw new Error(
				'Unauthorized Client Request, Bot is not available at this time, Please contact us at connect@machaao.com'
			);

		return jwt.verify(_rawBody, this.api_token, { algorithms: ['HS512'] }, function (err, decoded) {
			if (err)
				throw new Error(
					'Unauthorized Client Request, Bot is not available at this time, Please contact us at connect@machaao.com'
				);

			try {
				let _body =
					decoded && decoded.sub && decoded.sub.messaging ? decoded.sub : JSON.parse(decoded && decoded.sub);
				let resu = that.getMessagingEntries(_body);

				return resu;
			} catch (error) {
				throw new Error(`Error while parsing incoming message: ${error}`);
			}
		});
	}

	getUser(messaging) {
		const val = messaging.user;
		return val || null;
	}
}

module.exports = MessengerxSdk;
