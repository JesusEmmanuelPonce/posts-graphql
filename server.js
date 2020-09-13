const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const path = require('path')
const mongoose = require('mongoose')

// Multiple schemas
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")
const { loadFilesSync } = require("@graphql-tools/load-files")

require('dotenv').config()

const app = express()

const db = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_CLOUD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('DB success')
    } catch (error) {
        console.log(error)
    }
}

db()

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./typeDefs")))
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, "./resolvers")))

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

// apply middleware method connects Apollo Server to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app })

app.get('/api', (req, res) => {
    res.json({
        data: 'Endpoint!!!'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT}`)
    console.log(`Server ${process.env.PORT}${apolloServer.graphqlPath}`)
})