// import auth from 'controllers/auth';
// import accounts from 'controllers/accounts';
// import users from 'controllers/users';

module.exports = (app) => {

  /* auth */
  // app.post('/auth/local', auth.serializeUser, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
  // app.post('/auth/facebook', auth.facebook, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
  // app.post('/token/refresh', auth.validateRefreshToken, auth.generateAccessToken, auth.respondToken);
  // app.post('/token/reject', auth.rejectToken, auth.respondReject);

  /* account */
  // app.post('/account/create', accounts.create, auth.serializeClient, auth.generateAccessToken, auth.generateRefreshToken, auth.respondAuth);
  // app.post('/account/me/update', auth.isAuthenticated(), accounts.updateSettings);
  // app.post('/accounts/me/change_password', auth.isAuthenticated(), accounts.changePassword);
  // app.get('/accounts/verify_email', accounts.verifyEmail);

  /* users */
  // app.get('/users', users.index);
  // app.get('/users/me', auth.isAuthenticated(), users.me);
  // app.get('/users/profile/:id', users.profile);
  // app.post('/users/profile_image/update', auth.isAuthenticated(), users.updateProfileImage);
  // app.post('/users/me/destroy', auth.isAuthenticated(), users.destroy);
  
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'api.wouzoo.com'
      }
    });
  });
};
