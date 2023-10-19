const express = require("express");
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { mongoose } = require('mongoose');

const schema = require('./graphql/schema/index');
const resolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6ffjk24.mongodb.net/${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(3000);
    }).catch( err => {
        console.log('err', err);
    });


