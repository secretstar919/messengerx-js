const MxSdk = require('machaao');
const express = require('express');
const server = express();
const lib = new MxSdk('<Bot-Token>', 'prod', server);

server.post('/incoming', async (req, res) => {
	let x = await lib.getUserMessages(req); // read incoming user messages
	await lib.sendTextMessage(req, 'hi');
	await lib.sendButtonsOrQuickRepliesMessage(
		req,
		'test buttons',
		[{ title: 'button', type: 'postback', payload: 'Hi' }], // sample buttons
		[{ title: 'qr', content_type: 'text', payload: 'qr' }] // sample quick reply
	);

	//sample carousel
	await lib.sendCarousel(req, 'test carousel', [
		{
			title: 'title',
			subtitle: 'subtitle',
			image_url: 'https://provogue.s3.amazonaws.com/provogue-duffle1.jpg',
			buttons: [{ title: 'button', type: 'postback', payload: 'Hi' }],
		},
		{
			title: 'title',
			subtitle: 'subtitle',
			image_url: 'https://provogue.s3.amazonaws.com/provogue-duffle1.jpg',
			buttons: [{ title: 'button', type: 'postback', payload: 'Hi' }],
		},
		{
			title: 'title',
			subtitle: 'subtitle',
			image_url: 'https://provogue.s3.amazonaws.com/provogue-duffle1.jpg',
			buttons: [{ title: 'button', type: 'postback', payload: 'Hi' }],
		},
	]);

	res.send(200);
});

server.listen(3000);
