const indexRoutes = require('./index');
const authRoutes = require('./auth.routes');
const photoRoutes = require('./photo.routes');
const userRoutes = require('./user.routes');
const articlesRoutes = require('./post.routes');
const generalRoutes = require('./general.routes');

module.exports = (app) => {
    app.use('/public', indexRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/photo', photoRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/post', articlesRoutes);
    app.use('/api/general', generalRoutes);
}
