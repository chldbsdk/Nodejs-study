var fs = require('fs');

// //readFileSync
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt','utf8'); //동기 처리 방식으로 샘플txt 파일 읽어서 result 변수에 담기
// console.log(result);
// console.log('C');

console.log('A');
fs.readFile('syntax/sample.txt','utf8',function(err,result) { //비동기 처리 방식.. 세번째 매개변수에 콜백이 있음
    console.log(result);
});
console.log('C');