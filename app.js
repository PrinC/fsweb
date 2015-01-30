var restify = require('restify');
var redis = require('redis');
client = redis.createClient();

function getFileByPath(req, res, next) {
  console.log(req.params.path);
  client.hgetall(req.params.path, function(err, obj) {
    if (err) {
      res.send(err);
    }
    else {
      if (obj)
        res.send(obj);
      else
        res.send({});
    }
  });
}

function getFileByName(req, res, next) {
  client.lrange(req.params.file, 0, -1, function(err, result) {
    if (err)
      res.send(err);
    else
      res.send(result);
  });
}

function getFileByTimeRange(req, res, next) {
  client.zrangebyscore(req.params.type, parseInt(req.params.begin), parseInt(req.params.end), function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(result);
    }
  });
}
var server = restify.createServer();
server.use(restify.queryParser());
server.get('/path', getFileByPath);
server.get('/file/:file', getFileByName);
server.get('/range', getFileByTimeRange);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
