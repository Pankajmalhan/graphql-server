const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt
} = require("graphql");
const { fromSnakeCase } = require("../../lib/util");
const contestType=require("./contests");
const ActivityType=require('./activity');
const pgdb=require("../../database/pgdb");
const mdb=require("../../database/mdb");
module.exports = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: { type: GraphQLID },
        email: { type: new GraphQLNonNull(GraphQLString) },
        firstName: {
            type: GraphQLString,
        },
        lastName: {
            type: GraphQLString,
        },
        createdAt: {
            type: GraphQLString,
        },
        fullName:{
            type:GraphQLString,
            resolve:obj=>{ return `${obj.firstName} ${obj.lastName}`}
        },
        contests:{
            type:new GraphQLList(contestType),
            resolve:(obj,args,{loaders})=>{
            return loaders.getContestsForUserIds.load(obj.id)
            }
        },
        contestsCount:{
            type:GraphQLInt,
            resolve(obj,args,{loaders},{fieldName}){
                return loaders.mdb.usersByIds.load(obj.id).
                then(res=>res[fieldName])
            }
        },
        namesCount:{
            type:GraphQLInt,
            resolve(obj,args,{loaders},{fieldName}){
                return loaders.mdb.usersByIds.load(obj.id).
                then(res=>res[fieldName])
            }
        },
        votesCount:{
            type:GraphQLInt,
            resolve(obj,args,{loaders},{fieldName}){
                return loaders.mdb.usersByIds.load(obj.id).
                then(res=>res[fieldName])
            }
        },
        activities:{
            type:new GraphQLList(ActivityType),
            resolve(obj,args,{loaders}){
                return loaders.activitiesForUserIds.load(obj.id)
            }
        }
    }
})