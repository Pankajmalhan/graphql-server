
/*Older Version of file before implementing the caching anf batching */
// const humps = require("humps");
// module.exports = pgPool => {
//     return {
//         getUserByKey(apiKey) {
//             return pgPool.query(`select * from users
//             where api_Key=$1`, [apiKey]).then(res => {
//                     return humps.camelizeKeys(res.rows[0]);
//                 })
//         },
//         getUserById(userId) {
//             return pgPool.query(`select * from users
//             where id=$1`, [userId]).then(res => {
//                     return humps.camelizeKeys(res.rows[0]);
//                 })
//         },
//         getContests(user) {
//             return pgPool.query(`select * from contests where created_by=$1`, [user.id]).then(res => {
//                 return humps.camelizeKeys(res.rows);
//             })
//         },
//         getNames(contest) {
//             return pgPool.query(`select * from names where contest_id=$1`, [contest.id]).then(res => {
//                 return humps.camelizeKeys(res.rows);
//             })
//         }
//     }
// }






const humps = require("humps");
const _=require('lodash');
const {orderedFor,slug}=require("../lib/util");
module.exports = pgPool => {
    return {
        getUsersByApiKeys(apiKeys) {
            return pgPool.query(`select * from users
            where api_Key=ANY($1)`, [apiKeys]).then(res => {
                    return orderedFor(res.rows,apiKeys,'apiKey',true);
                })
        },
        getUserByIds(userIds) {
            return pgPool.query(`select * from users
            where id=ANY($1)`, [userIds]).then(res => {
                    return orderedFor(res.rows,userIds,'id',true)
                })
        },
        getContestsForUserIds(userIds) {
            return pgPool.query(`select * from contests where created_by=ANY($1)`, [userIds]).then(res => {
                return orderedFor(res.rows,userIds,'createdBy',false);
            })
        },
        getNamesForContestIds(contestIds) {
            return pgPool.query(`select * from names where contest_id=ANY($1)`, [contestIds]).then(res => {
                return orderedFor(res.rows,contestIds,'contestId',false);
            })
        },
        addNewContest({apiKey,title,description}){
            return pgPool.query(`insert into contests(code, title, description, created_by)
            values($1,$2,$3,(select id from users where api_key=$4))
            returning *`,[slug(title),title,description,apiKey]).then(res=>{
                return humps.camelizeKeys(res.rows[0])
            })
        },
        addContestName({apiKey,label,description,contestId}){
            console.log({apiKey,label,description,contestId});
            return pgPool.query(`insert into names(contest_id, label, normalized_label, description, created_by)
            values($1,$2,$3,$4,(select id from users where api_key=$5))
            returning *`,[contestId,slug(label),slug(label),description,apiKey]).then(res=>{
                return humps.camelizeKeys(res.rows[0])
            })
        },
        getActivitiesForUserIds(userIds){
            return pgPool.query(`
            select created_by ,created_at, label, '' as title, 'name' as activity_name
            from names where created_by=ANY($1)
            union
            select created_by, created_at, '' as label, title, 'contest' as activity_name
            from contests where created_by=ANY($1) `,[userIds]).then((res)=>{
                return orderedFor(res.rows,userIds,'createdBy',false)
            })
        }
    }
}