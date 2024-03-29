var http=require('http');
var fs=require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${control}
  ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list='<ul>';
  var i=0;
  while(i<filelist.length) {
  list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  i=i+1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname=url.parse(_url,true).pathname; //URL 정보 중 경로 이름만 추출
    console.log(queryData.id);
    if(pathname ==='/') { //루트라면 기존 코드를 실행
      if(queryData.id === undefined) { //쿼리 스트링이 없을 때의 처리(홈일 때)
        
        fs.readdir('./data',function(error,filelist) {
          var title='Welcome';
          var description = 'Hello , Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title,list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(template);
          //response.end('egoing  : ' +url);
          //response.end(fs.readFileSync(__dirname + _url));
          //fs.readFileSync를 이용해 웹 브라우저가 요청한 파일 (__dirname+url)을 읽어서 응답함
        });
      } else { //쿼리 스트링이 있을 때의 처리(홈이 아닐 때)
        fs.readdir('./data',function(error,filelist) {
          var list = templateList(filelist);
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description) {
            var title = queryData.id;
            var template =templateHTML(title,list,
              `<h2>${title}</h2><p>${description}</p>`,
              `<a href="/create">create</a> 
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`
              );
            response.writeHead(200);
            response.end(template);
          });
        });
      }
      
    } else if(pathname ==='/create') {
      fs.readdir('./data',function(error,filelist) {
        var title='WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title,list,`
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,'');
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname==='/create_process') {
      var body ='';
      request.on('data',function(data) {
        body=body + data
      });
      request.on('end',function() {
        var post=qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',function(err) {
          response.writeHead(302,{Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if(pathname === '/update') {
      fs.readdir('./data',function(error,filelist) {
        fs.readFile(`data/${queryData.id}`,'utf8',function(err,description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title,list,
            `
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p><textarea name="description" placeholder="description">${description}</textarea></p>
              <p><input type="submit"></p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(template);
        });
      });
    } else if(pathname==='/update_process') {
      var body="";
      request.on('data',function(data) {
        body=body+data;
      });
      request.on('end',function() {
        var post=qs.parse(body);
        var id=post.id;
        var title=post.title;
        var description=post.description;
        fs.rename( `data/${id}`,`data/${title}`,function(error) {
          fs.writeFile('data/${title}',description,'utf8',function(err) {
            response.writeHead(302,{Location:`/?id=${title}`});
            response.end();
          });
        });
      });
    } else if(pathname==='/delete_process') {
      var body="";
      request.on('data',function(data) {
        body=body+data;
      });
      request.on('end',function() {
        var post=qs.parse(body);
        var id=post.id;
        fs.unlink(`data/${id}`,function(error) {
          response.writeHead(302,{Location:`/`});
          response.end();
        });
      });
    } else { //루트가 아닐 때의 처리 (404 오류 페이지)
      response.writeHead(404);
      response.end('Not found');
    }
    
});
app.listen(3000); //포트번호 3000

//node.js를 웹 서버로 만들어주는 코드