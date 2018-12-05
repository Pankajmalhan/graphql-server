// const {
//     GraphQLObjectType,
//     GraphQLNonNull,
//     GraphQLString,
//     GraphQLID,
//     GraphQLList
// } = require("graphql");

// const contestStatusType = require("./contest-status");
// const pgdb=require("../../database/pgdb");
// const NameType=require("./name");
// module.exports = new GraphQLObjectType({
//     name: 'ContestType',
//     description: "This Provide the contest related information about the user",
//     fields: {
//         id: { type: GraphQLID },
//         code: { type: new GraphQLNonNull(GraphQLString) },
//         title: { type: new GraphQLNonNull(GraphQLString) },
//         description: { type: new GraphQLNonNull(GraphQLString) },
//         status: { type: new GraphQLNonNull(contestStatusType) },
//         createdAt: { type: new GraphQLNonNull(GraphQLString) },
//         names:{
//             type:new GraphQLList(NameType),
//             resolve(obj,arg,{pgPool}){
//                 return pgdb(pgPool).getNames(obj);
//             }
//         }
//     }
// });



const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLList
} = require("graphql");

const contestStatusType = require("./contest-status");
const pgdb=require("../../database/pgdb");
const NameType=require("./name");
module.exports = new GraphQLObjectType({
    name: 'ContestType',
    description: "This Provide the contest related information about the user",
    fields: {
        id: { type: GraphQLID },
        code: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(contestStatusType) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        names:{
            type:new GraphQLList(NameType),
            resolve(obj,arg,{loaders}){
                return loaders.getNamesForContestIds.load(obj.id);
            }
        }
    }
});