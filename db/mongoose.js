const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/test';

mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true , useFindAndModify: false});

// Stop to Pluralize the model name
mongoose.pluralize(null);