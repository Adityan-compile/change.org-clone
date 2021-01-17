let MongoClient = require('mongodb').MongoClient;

let host = process.env.DB_HOST;
let dbName = process.env.DB_NAME;
let state = {
        db : null
}


module.exports.connect = function(done){
        MongoClient.connect(host, (err,data)=>{
                if (err) {
                        return done(err)
                }else{
                        state.db = data.db(dbName)
                }
        });

        done()
}


module.exports.get = function(){
        return state.db
}