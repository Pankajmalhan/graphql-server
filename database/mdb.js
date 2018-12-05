// const {orderedFor}=require("../lib/util");

// module.exports=mPool=>{
//     return{
//         getCounts(user,countField){
//             return mPool.collection('users')
//             .findOne({userId:user.id})
//             .then(userCounts=>userCounts[countField])
//         }
//     }
// }


const {orderedFor}=require("../lib/util");

module.exports=mPool=>{
    return{
        getUsersById(userIds){
            return mPool.collection('users')
            .find({userId:{$in:userIds}})
            .toArray()
            .then(rows=>orderedFor(rows,userIds,'userId',true))
        }
    }
}