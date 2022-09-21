var number=[1,400,12,34]; //배열 생성
var i=0; //변수 초기화
var total=0;
while(i<number.length) {
    total = total+number[i];
    //console.log(number[i]); //배열의 첫번째부터 다섯번째 요소까지 차례로 조회
    i=i+1; //i의 값 1 증가
}
console.log(`total : ${total}`);
