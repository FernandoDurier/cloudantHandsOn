var doc = require('./docDao.js');

exports.massin = function(req,res){
  doc.massInsert().then(function(data){
    if(data.status === "done"){
      res.status(200);
      res.end("{\"status\":\"done\"}");
    }
  });
}
