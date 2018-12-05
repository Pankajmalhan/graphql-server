/*Older code before implementing the caching and batching */

// const { nodeEnv } = require('./util');
// console.log(`Running in ${nodeEnv} mode...`);

// const express=require('express');
// const app=express();
// const ncSchmea=require('../schema');
// const port=process.env.PORT || 3000;
// const graphqlHTTP=require('express-graphql');
// const pg=require("pg");
// const DataLoader=require('dataloader');
// const pgConfig=require("../config/pg")[nodeEnv];
// const pgPool=new pg.Pool(pgConfig);
// const appRouter=require("../routes/app");
// const assert=require("assert")
// const {MongoClient}=require("mongodb");
// const mConfig=require("../config/mongo")[nodeEnv];
// const path=require("path")
// global.__basedir = path.join(__dirname+"/..");
// process.on('uncaughtException',(err)=>{
//     console.log({err});
// });
// process.on('unhandledRejection',(err)=>{
//     console.log({err});
// })
// const { message } = new assert.AssertionError({
//     actual: 1,
//     expected: 2,
//     operator: 'strictEqual'
//   });
// MongoClient.connect(mConfig.url,(err,mPool)=>{
//     app.use('/graphql',graphqlHTTP({
//         schema:ncSchmea,
//         graphiql:true,
//         context:{
//             pgPool,
//             mPool
//         }
//     }));

//     app.use("/api",appRouter);
//     app.listen(port,()=>{
//         console.log('Sever is running at port: ',port,new Date())
//     });
// })
// app.use("/api",appRouter);

// // app.listen(port,()=>{
// //     console.log('Sever is running at port: ',port,new Date())
// // });









const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const express=require('express');
const app=express();
const ncSchmea=require('../schema');
const port=process.env.PORT || 3000;
const graphqlHTTP=require('express-graphql');
const pg=require("pg");
const DataLoader=require('dataloader');
const pgConfig=require("../config/pg")[nodeEnv];
const pgPool=new pg.Pool(pgConfig);
const pgdb=require("../database/pgdb")(pgPool);
const appRouter=require("../routes/app");
const assert=require("assert")
const {MongoClient,Logger}=require("mongodb");
const mConfig=require("../config/mongo")[nodeEnv];
const path=require("path")
global.__basedir = path.join(__dirname+"/..");
process.on('uncaughtException',(err)=>{
    console.log({err});
});
process.on('unhandledRejection',(err)=>{
    console.log({err});
})
const { message } = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
  });
MongoClient.connect(mConfig.url,(err,mPool)=>{
    console.log({err});
    assert.equal(err,null);
    Logger.setLevel('debug');
    Logger.filter('class',['Server']);
    const mdb=require("../database/mdb")(mPool);
    app.use('/graphql',(req,res)=>{
        const loaders={
            usersByIds:new DataLoader(pgdb.getUserByIds),
            getUsersByApiKeys:new DataLoader(pgdb.getUsersByApiKeys),
            getContestsForUserIds:new DataLoader(pgdb.getContestsForUserIds),
            getNamesForContestIds:new DataLoader(pgdb.getNamesForContestIds),
            activitiesForUserIds:new DataLoader(pgdb.getActivitiesForUserIds),
            mdb:{
                usersByIds:new DataLoader(mdb.getUsersById)
            }
        }
        graphqlHTTP({
            schema:ncSchmea,
            graphiql:true,
            context:{
                pgPool,
                mPool,
                loaders
            }
        })(req,res)
    });

    app.use("/api",appRouter);
    app.listen(port,()=>{
        console.log('Sever is running at port: ',port,new Date())
    });
})
app.use("/api",appRouter);

// app.listen(port,()=>{
//     console.log('Sever is running at port: ',port,new Date())
// });
