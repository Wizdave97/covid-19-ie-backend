const fs=require('fs');
const path=require('path');
const pwd = process.cwd();
module.exports = {
    readLogs:function(callback){
        fs.readFile(path.join(pwd,'logs/access.log'),'utf8',callback)
    }
}