var fs=require('fs');

console.log('a');

fs.readFile('b.txt','utf8',(err,data) => {
    if (err) throw err;
    console.log(data);
});

var syncData = fs.readFileSync('b.txt','utf8');
console.log(syncData);

console.log('c');

