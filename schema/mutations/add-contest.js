const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull
}=require('graphql');

const pgdb=require('../../database/pgdb');
const ContestType=require('../types/contests');
const ContestTypeInput=new GraphQLInputObjectType({
    name:'ContestInput',
    fields:{
        apiKey:{type:new GraphQLNonNull(GraphQLString)},
        title:{type:new GraphQLNonNull(GraphQLString)},
        description:{type:GraphQLString},
    }
});

module.exports={
    type:ContestType,
    args:{
        input:{type:new GraphQLNonNull(ContestTypeInput)}
    },
    resolve(obj,{input},{pgPool}){
        return pgdb(pgPool).addNewContest(input)
    }
}