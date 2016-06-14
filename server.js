/**
 * Created by prprak on 6/14/2016.
 */
var http = require('http');
var port = process.env.port || 8080;

var log = function(msg) {
    console.error(msg);
};

var getParameterByName =  function(name, url) {
    try {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURI(results[2].replace(/\+/g, ' ').replace(/\%3A/g,':').replace(/\%2F/g,'/'));
    } catch (err) {
        log(err);
    }
    return null;
};

var writeResponseHeaders = function (res, existing) {
    try {
        var resHeaders = existing || {};
        resHeaders['Access-Control-Allow-Credentials'] = 'true';
        resHeaders['Access-Control-Allow-Headers'] = 'content-type,authorization,session-id,request-id,x-requested-with';
        resHeaders['Access-Control-Allow-Origin'] = '*';
        res.writeHead(200, resHeaders);
    } catch (err) {
        log(err);
    }
};

var writeResponse = function(res, message) {
    try {
        writeResponseHeaders(res, null);
        if (message) {
            res.write(message);
        }
        res.end();
    } catch (err) {
        log(err);
    }
};

var getRequestOptions = function(uri, req) {
    var options = null;
    try {
        var urinoproto = uri.replace('http://', '').replace("https://", '')
        var hostpath = urinoproto.split('/');
        var path = hostpath.length > 1 ? urinoproto.replace(hostpath[0], '') : '/';
        var hostport = hostpath[0].split(':');
        var port = 80;
        var host = hostport[0];
        if (hostport.length > 1) {
            port = hostport[1];
        }

        options = {
            hostname: host,
            port: port,
            path: path,
            method: req.method,
            headers: { host: host}
        };
    } catch (err) {
        log(err);
    }

    return options;
};

var makeRequest = function (options, req, res) {
    var httpreq = null;
    try {
        httpreq = http.request(options, (serverres) => {
            try {
                writeResponseHeaders(res, serverres.headers);
                serverres.setEncoding('utf8');
                serverres.on('data', (chunk) => {
                    try {
                        res.write(chunk);
                    } catch (err) {
                        log(err);
                    }
                });
                serverres.on('end', () => {
                    try {
                        res.end();
                    }
                    catch(err) {
                        log(err);
                    }
                });
            } catch(err) {
                log(err);
                res.end();
            }

        });
        if (req.method &&
            (req.method.toLowerCase() == 'post' ||
            req.method.toLowerCase() == 'patch')) {
            var postData = {}; // TODO: add post data here
            httpreq.write(postData);
        }
    } catch (ex) {
        log(ex);
    }
    finally {
        if (httpreq) {
            httpreq.end();
        }
    }
};

var execute = function (req, res) {
    var uri = getParameterByName('host', req.url);
    if ((req.method &&
        req.method.toLowerCase() == 'options') ||
        !uri) {
        writeResponse(res);
    } else if (uri) {
        log(uri);
        var options = getRequestOptions(uri, req);
        if (options) {
            makeRequest(options, req, res);
        } else {
            writeResponse(res, '<h2>Request options could not be generated. Please see server logs.</h2>');
        }
    }
};

http.createServer(execute).listen(port);
log('server listening at port ' + port);
