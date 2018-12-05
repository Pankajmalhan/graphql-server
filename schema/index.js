// const {
//     GraphQLSchema,
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLNonNull,
//     GraphQLInt
// } = require('graphql');
// const UserType = require("./types/user");
// const pgdb=require("../database/pgdb");
// const mdb=require("../database/mdb");
// const GraphQueryType = new GraphQLObjectType({
//     name: 'GrapghQueryType',
//     fields: {
//         me: {
//             type: UserType,
//             description: "This is required field",
//             args: {
//                 key: {
//                     type: new GraphQLNonNull(GraphQLString)
//                 }
//             },
//             resolve: (obj,args,{pgPool}) => {
//                 return pgdb(pgPool).getUserByKey(args.key);
//             }
//         }
//     }
// })
// const ncSchema = new GraphQLSchema({
//     query: GraphQueryType
// });

// module.exports = ncSchema;










const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const UserType = require("./types/user");
const pgdb=require("../database/pgdb");
const mdb=require("../database/mdb");
const GraphQueryType = new GraphQLObjectType({
    name: 'GrapghQueryType',
    fields: {
        me: {
            type: UserType,
            description: "This is required field",
            args: {
                key: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (obj,args,{loaders}) => {
                return loaders.getUsersByApiKeys.load(args.key);
            }
        }
    }
})

const AddContestMutation=require("./mutations/add-contest");
const AddNameForContest=require("./mutations/add-names");
const RootMutationType=new GraphQLObjectType({
    name:'RootMutationType',
    fields:()=>({
        AddContest:AddContestMutation,
        AddName:AddNameForContest
    })
})
const ncSchema = new GraphQLSchema({
    query: GraphQueryType,
    mutation:RootMutationType
});

module.exports = ncSchema;