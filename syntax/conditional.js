var args=process.argv; //프로그램을 실행할 때 함께 넘어온 입력값을 args 변수에 저장한다는 의미. 배열 변수임
console.log(args[2]);
console.log('A');
console.log('B');
if(args[2]==='1') {
    console.log('C1');
} else {
    console.log('C2');
}
console.log('D');