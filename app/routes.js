'use strict';

const auth = require('./controllers/auth');
const accounts = require('./controllers/accounts');
const users = require('./controllers/users');
const projects = require('./controllers/projects');
const requests = require('./controllers/requests');
const comments = require('./controllers/comments');
const quotes = require('./controllers/quotes');
// const pages = require('./controllers/pages');


module.exports = function (app) {

	/* auth */
	app.post('/auth/local', auth.serializeUser, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
	app.post('/auth/facebook', auth.facebook, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
	app.post('/token/refresh', auth.validateRefreshToken, auth.generateAccessToken, auth.respondToken);
	app.post('/token/reject', auth.rejectToken, auth.respondReject);

	/* account */
	app.post('/account/create', accounts.create, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
	app.post('/account/me/update', auth.isAuthenticated(), accounts.updateSettings);
	// app.post('/accounts/me/change_password', auth.isAuthenticated(), accounts.changePassword);
	// app.get('/accounts/verify_email', accounts.verifyEmail);

	/* users */
	// app.get('/users', users.index);
	app.get('/users/me', auth.isAuthenticated(), users.me);
	// app.get('/users/profile/:id', users.profile);
	app.post('/users/profile_image/update', auth.isAuthenticated(), users.updateProfileImage);
	// app.post('/users/me/destroy', auth.isAuthenticated(), users.destroy);	

	/* project - user side */
	app.post('/projects/create', auth.isAuthenticated(), projects.create);
	app.post('/projects/inactive', auth.isAuthenticated(), projects.inactive);
	app.get('/projects/my', auth.isAuthenticated(), projects.my);
	app.get('/projects/:id/quotes', auth.isAuthenticated(), projects.quotes);
	app.get('/projects/:id', auth.isAuthenticated(), projects.detail); // need bids info

	/* requests - pro side */
	app.get('/requests/me', auth.isAuthenticated(), requests.me);
	app.get('/requests/:id', auth.isAuthenticated(), projects.detail);

	/* Quotes */
	app.post('/quotes/create', auth.isAuthenticated(), quotes.create);
	app.post('/quotes/pick', auth.isAuthenticated(), quotes.pick);
	app.get('/quotes/my', auth.isAuthenticated(), quotes.my);
	app.get('/quotes/my/:id', auth.isAuthenticated(), quotes.myQuote);
	app.get('/quotes/:id', auth.isAuthenticated(), quotes.detail);
	
	/* messages */
	app.post('/comments/create', auth.isAuthenticated(), comments.create);
	app.get('/comments/quotes/:id', auth.isAuthenticated(), comments.comments);
	// app.get('/messages/sent', auth.isAuthenticated(), messages.sent);
	// app.get('/messages/:id', messages.message);

	/* comments */
	// app.post('/comments/create')
	// app.post('/comments/delete')
	// app.get('/comments')

	/* pages */
	// app.post('/pages/create', auth.isAuthenticated(), pages.create);
	// app.post('/pages/update', auth.isAuthenticated(), pages.update);
	// app.get('/pages/me', auth.isAuthenticated(), pages.index);
	// app.get('/pages/:id', pages.page);


	app.get('/', function (req, res) {
		res.status(200).json({
			status: 'success',
			data: {
				message: 'api.wouzoo.com'
			}
		});
	});
};
