

const getUserDetails = (userName) => {
    return new Promise((resolve, reject) => {
        db.collection('test').find({ 'username': userName }).toArray((err, docs) => {
            if(docs && docs.length>0){
                resolve(docs[0]);
            }else{
                reject()
            }
        });
    });
}

const updateUserPassword = (db, userName, pwd) => {
    return db.collection('user').updateOne({'username' : userName},{ $set: {password: pwd}})
    .then(result => {
        return Promise.resolve(result.matchedCount);
    })
    .catch(error => {
        return Prormise.reject(error);
    })
}

module.exports = { getUserDetails, updateUserPassword }