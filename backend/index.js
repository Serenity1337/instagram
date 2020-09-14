

const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors')
const graphQLSchema = require('./graphql/schema/index')

const graphQLResolvers = require('./graphql/resolvers/index')

const app = express();

app.use(bodyParser.json());

app.use(cors())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, '../frontend/public/images/postpics')
},
filename: function (req, file, cb) {
  cb(null,file.originalname )
}
})

const upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
 
upload(req, res, function (err) {
       if (err instanceof multer.MulterError) {
           return res.status(500).json(err)
       } else if (err) {
           return res.status(500).json(err)
       }
  return res.status(200).send(req.file)

})

});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);



mongoose.connect("mongodb://localhost:27017/instagramDB", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(8000, () => {
    console.log('server is running on port 8000')
  })
}).catch(err => {
  console.log(err)
})





