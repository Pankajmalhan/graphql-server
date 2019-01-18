


const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
const graphqlHTTP=require('express-graphql');
const pg=require("pg");
const DataLoader=require('dataloader');
const assert=require("assert")
const path=require("path")
const bodyParser=require('body-parser');
const { buildSchema}=require('graphql');

app.use(bodyParser.json())

app.use('/graphql',graphqlHTTP({
    
    schema:buildSchema(`
        type RootQuery{
            events: [String!]!
        }

        type RootMutation {
            createEvent(name:String):String
        }

        schema {
            query:RootQuery,
            mutation:RootMutation
        }
    `),
    rootValue:{
        events:()=>{
            return ['Pankaj','Rahul','sandeeo']
        },
        createEvent:(args)=>{
            return args.name+ ' created'
        }
    },
    graphiql:true    
})
)
  app.get("/api",(req,res,next)=>{
      res.status(200).send('1200');
  });
    app.listen(port,()=>{
        console.log('Sever is running at port: ',port,new Date())
    });



// app.listen(port,()=>{
//     console.log('Sever is running at port: ',port,new Date())
// });
