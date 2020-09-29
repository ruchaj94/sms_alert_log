const FS = require('fs');
// const abe = require('')xfs

FS.readFile('../../DAL new/database-access-engine-version-2/JSON/sample.txt', (err, data)=>{
    // let values = JSON.parse(data.toString()_;
    // console.log(values.slave_id);
})

exports.getFileJSON = async()=>{
    let data = FS.readFileSync('../../DAL new/database-access-engine-version-2/JSON/sample.txt');
    let values = JSON.parse(data);
    console.log(values.slave_id);
    return values;
}

// this.getFileJSON();