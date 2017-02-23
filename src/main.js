var doc = require('./docDao.js');

exports.massin = function(req,res){
  doc.massInsert().then(function(data){
    if(data.status === "done"){
      res.status(200);
      res.end("{\"status\":\"done\"}");
    }
  });
}

exports.select = function(req,res){
  doc.select(req.body.FILTER).then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.selectget = function(req,res){
  doc.selectget(req.params.filter,req.params.value).then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.put = function(req,res){
  doc.updateDoc(req.body._id,req.body._rev,req.body.NAME,req.body.CITY,req.body.COUNTRY,req.body.TELEPHONE,req.body.EMAIL)
  .then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}
