// Ben Webb
// node.js

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring');

// Create server
http.createServer(
    function (req, resp) {
        // Parse the request containing file name
        var pathname = url.parse(req.url, true).pathname;
        var query = url.parse(req.url, true).query;
                  
        // Print the name of the file
        console.log('Request for ' + pathname);
        switch (pathname.substr(-4)) {
             // If the request if asking for an IP
            case "calc":
                  // Write response
                  resp.writeHead(200, {'Content-Type': 'text/html'});
                  resp.write(JSON.stringify(result));
                  resp.end();
                  break;
            default:
                  // Read the requested file content from file system
                  fs.readFile(pathname.substr(1), function (err, data) {
                  if (err) {
                    console.log(err);
                    resp.writeHead(404, {'Content-Type': 'text/html'});
                  } else {
                        var dotoffset = req.url.lastIndexOf('.');
                        var mimetype = dotoffset == -1
                              ? 'text/plain'
                              : {
                              '.html' : 'text/html',
                              '.ico' : 'image/x-icon',
                              '.jpg' : 'image/jpeg',
                              '.png' : 'image/png',
                              '.gif' : 'image/gif',
                              '.css' : 'text/css',
                              '.js' : 'text/javascript'
                              }[ req.url.substr(dotoffset) ];
                              resp.setHeader('Content-type' , mimetype);
                    resp.write(data.toString());
                }
                // Send response body
                resp.end();
            });
        }
    }
).listen(8000);
// Console will print the message
console.log('Server running at http://localhost:8000/');
