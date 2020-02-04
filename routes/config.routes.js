const indexRoutes = require('./index');
const authRoutes = require('./auth.routes');
const photoRoutes = require('./photo.routes');
const userRoutes = require('./user.routes');
const articlesRoutes = require('./post.routes');
const videoRoutes = require('./video.routes');
const generalRoutes = require('./general.routes');

module.exports = (app) => {
    app.use('/public', indexRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/index', indexRoutes);
    app.use('/api/photo', photoRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/articles', articlesRoutes);
    app.use('/api/video', videoRoutes);
    app.use('/api/general', generalRoutes);
}