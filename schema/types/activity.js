const {
    GraphQLUnionType,
    GraphQLString
} = require("graphql");

const ContestType=require('./contests');
const NameType=require('./name');

module.exports=new GraphQLUnionType({
    name:'Activity',
    types:[ContestType,NameType],
    resolveType(value){
        console.log({value})
        return value.activityType==='contest'?ContestType:NameType
    }  
})