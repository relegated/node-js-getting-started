let http = require('http');

http.createServer(onRequest).listen(8888);

function onRequest(req, res) {
    
    if (req.url === "/home"){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("<h1>Hello world</h1>");
        res.end();
    }
    else if (req.url === "/getData"){
        res.writeHead(200, {'Content-Type' : 'application/json'});
        let responseData = { name : "Brett Jensen", class : "cs313" };
        let responseJson = JSON.stringify(responseData);
        res.end(responseJson);
    }
    else if (req.url === "/today") {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        res.write("<h1>" + mm + "/" + dd + "/" + yyyy + "</h1>");
        res.end();
    }
    else {
        res.writeHead(404, {'Content-Type' : 'text/html' });
        res.write("<h1>Page Not Found</h1>");
        res.end();
    }
}