![alt text](https://www.messengerx.io/img/logo.png 'MessengerX.io')  

[![Gitter](https://badges.gitter.im/messengerx-io/community.svg)](https://gitter.im/messengerx-io/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)  

# Build, develop and launch your chat apps on Web and Android

NodeJS package for MessengerX.io REST APIs
npm module for building chatbots using MessengerX APIs.

## Documentation

-   Visit https://messengerx.rtfd.io/ for full documenation.

## Installation

```
npm i --save machaao
```

## Quick Start Guide

-   Register via [MessengerX Developer Portal](https://portal.messengerx.io) and verify your account.
-   Create a new bot by clicking on 'Add New App'

    ![alt text](https://messengerx.readthedocs.io/en/latest/_images/mxio_home.png 'Create a new bot')

-   You can set Webhook and Image Url as None till deployment of your Chat App to get started.
-   Once your bot is created, click on Settings and copy 'Token' value.
-   Install npm package in your server file by running `npm i --save machaao`
-   Initialize the MessengerX SDK as show in the example below which takes in the `Token` that you copied in the above step, `environment` which is either dev or prod (default is dev) and `server` object. Currently our SDK supports express server object and other libraries will be supported in upcoming releases:

```
const MxSdk = require('machaao');
const express = require('express');
const server = express();
const lib = new MxSdk('<----Bot Token----->', 'dev', server);

server.listen(3000);

```

-   Once you have initialised the SDK, you can easily read incoming user messages and send responses back to the user (Simple Text, Buttons, Quick Replies and Carousel)
-   In order for the integration to be complete, you will need to update your bot settings in portal and update the Webhook Url with your server url and endpoint. (You may choose to use [Ngrok.io](https://ngrok.io) for development purpose to test the integration.)
-   Check out below sample that shows how you can setup a webhook that accepts incoming user message and responds back to the user.

```
const MxSdk = require('machaao');
const express = require('express');
const server = express();
const lib = new MxSdk('<---Bot Token---->', 'dev', server);

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

```

## Support

For any queries or questions, please write to [support@messengerx.io](mailto:support@messengerx.io) to reach us.

## Release Notes

### v 0.1.8

-   Added support for User Tags API.
-   Better API response handling
