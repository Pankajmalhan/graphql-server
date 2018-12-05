const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
}=require('graphql');

const pgdb=require('../../database/pgdb');
const NameType=require('../types/name');

const ContestNameInput=new GraphQLInputObjectType({
    name:'NameInput',
    fields:{
        apiKey:{type:new GraphQLNonNull(GraphQLString)},
        label:{type:new GraphQLNonNull(GraphQLString)},
        description:{type:GraphQLString},
        contestId:{type:new GraphQLNonNull(GraphQLString)}
    }
});

module.exports={
    type:NameType,
    args:{
        input:{type:new GraphQLNonNull(ContestNameInput)}
    },
    resolve(obj,{input},{pgPool}){
        return pgdb(pgPool).addContestName(input)
    }
}