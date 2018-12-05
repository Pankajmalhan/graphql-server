const {
GraphQLEnumType
}=require("graphql");

module.exports=new GraphQLEnumType({
    name:'ContestStatusType',
    description: "Following are the values for this field",
    values:{
        DRAFT:{value:'draft'},
        PUBLISHED:{value:'published'},
        ARCHIVED:{value:'archived'},
    }
});