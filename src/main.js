var doc = require('./docDao.js');

exports.massin = function(req,res){
  doc.massInsert().then(function(data){
    if(data.status === "done"){
      res.status(200);
      res.end("{\"status\":\"done\"}");
    }
  });
}

exports.massdel = function(req,res){
  doc.massDel(req.body.url,req.body.database).then(function(data){
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

exports.delete = function(req,res){
  doc.deleteDoc(req.body._id,req.body._rev)
  .then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.post = function(req,res){
  doc.insertDoc(req.body.NAME,req.body.CITY,req.body.COUNTRY,req.body.TELEPHONE,req.body.EMAIL)
  .then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.getAll = function(req,res){
  doc.selectEveryDoc().then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.postAny = function(req,res){
  doc.insertAny(req.body.ajson).then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.postBulky = function(req,res){
  //console.log( JSON.stringify(req.body.array) );
  doc.bulkInsert(req.body.array).then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}

exports.putBulky = function(req,res){
  //console.log( JSON.stringify(req.body.array) );
  doc.bulkUpdate(req.body.array,req.body.upfield,req.body.neoValue).then(function(data){
    res.status(data.status);
    res.end(JSON.stringify(data.body));
  });
}
