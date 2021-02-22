require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

//TODO:
// For SSR
// const react = require('react');
// const ReactDOMServer = require('react-dom/server');
// const StaticRouter = require('react-router-dom/').StaticRouter;
// const MainRouter = require('../client/src/MainRouter');

const config = require('./config/config');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const auth = require('./middlewares/auth');

const app = express();
//MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(auth.isAuthenticated);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res, next) => {
    res.status(200).send({ message: 'homepage' });
});

// error handler middleware
app.use((err, req, res, next) => {
    // Delete the file if is in the request
    if (req.file) {
        fs.unlink(req.file.path, () => {
            //Failed to delete file
        });
    }
    if (res.headerSent) {
        return next(error);
    }

    res.status(err.errorCode || 500);
    res.json({
        message: err.message || 'An unknown error has occurred.',
    });
});

/*----------- MONGOOSE + Server start ----------- */

mongoose
    .connect(config.mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        app.listen(config.port, (err) => {
            if (err) {
                console.log(err);
            }
            console.info(`server is listening on port ${config.port}`);
        });
    });
