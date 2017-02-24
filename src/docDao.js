var Q = require('q');
var request = require('request');
var cloudant = require('../config/cloudant.json');
var cred = cloudant.cred;

var docTemplate =
{
  "NAME":null,
  "CITY":null,
  "COUNTRY":null,
  "TELEPHONE":null,
  "EMAIL":null
};

exports.massInsert = function(){
  var massDefer = Q.defer();

  for(var i=0;i<10;i++){
    var interJson = docTemplate;
    interJson.NAME = "Teste "+i;
    interJson.EMAIL = "Teste"+i+"@br.ibm.com";
    interJson.TELEPHONE =
    "(" + Math.ceil(Math.random()*10) + Math.ceil(Math.random()*10) + ") 9 "+
    Math.ceil(Math.random()*10) + Math.ceil(Math.random()*10) + Math.ceil(Math.random()*10) +
    Math.ceil(Math.random()*10) + " - " + Math.ceil(Math.random()*10) + Math.ceil(Math.random()*10) +
    Math.ceil(Math.random()*10) + Math.ceil(Math.random()*10);

    if(i%2 == 0){
      interJson.CITY = "RIO DE JANEIRO";
      interJson.COUNTRY = "BRAZIL";
    }
    else{
      interJson.CITY = "HORTOLANDIA";
      interJson.COUNTRY = "BRAZIL";
    }

    request({
        url:  cred[0].url + "/" + cred[0].database,
        method: 'POST',
				json: interJson
    }, function(error, response, body){
        if(error) {

        	console.log("erro de post");
            console.log(error);
        }
        else {
        	  console.log("resultado do post");
            console.log(response.statusCode, body);
        }
    });
  }

  setTimeout(
    function(){
      massDefer.resolve({"status":"done"});
    },2000
  );

  return massDefer.promise;
}


var massDelete = function(url,database){
  var massDefer = Q.defer();
  var getAllDocs = url+"/"+database+"/_find";
  var getQuery = {
                  "selector": {
                    "_id": {
                      "$gt": 0
                    }
                  },
                  "fields": [
                    "_id",
                    "_rev"
                  ],
                  "sort": [
                    {
                      "_id": "asc"
                    }
                  ]
                };
      var selectAll = function(){
          var seleDefer = Q.defer();
          request({
                url: getAllDocs,//URL to hit
                method: 'POST',
                json:getQuery
            }, function(error, response, body){
                if(error) {
                    console.log(error);
                    seleDefer.reject(error);
                }
                else {
                    //console.log(response.statusCode, JSON.parse(body).rows );
                    //console.log(body.docs);
                    var alter = function(){
                      var alterDefer = Q.defer();
                      //console.log('---alter----');
                      //console.log(body.docs);
                      for(var i=0;i<body.docs.length;i++){
                        body.docs[i]._deleted = true;
                      //  console.log(body.docs);
                        if(i+1>=body.docs.length){
                          alterDefer.resolve({"status":true});
                        }
                      }
                      return alterDefer.promise;
                    }
                    alter().then(function(data){if(data.status){
                      //console.log(data);
                      massDefer.resolve({"docs":body.docs});
                      seleDefer.resolve({"docs":body.docs});
                    }});

                }
            });
            return seleDefer.promise;
      }
      selectAll();
      return massDefer.promise;
};

exports.massDel = function(url,database){
  var mdDefer = Q.defer();
massDelete(url,database)
.then(
  function(data){
    var bulkPreparing = Q.defer();
    console.log(data);
    bulkPreparing.resolve(data);
    return bulkPreparing.promise;
  }).then(function(data){
    var massDeleteFinalDefer = Q.defer();
      request({
            url: url+"/"+database+"/_bulk_docs",//URL to hit
            qs: {from: 'tp fernando', time: new Date()}, //Query string data
            method: 'POST',
            json:data
        }, function(error, response, body){
            if(error) {
                console.log(error);
                massDeleteFinalDefer.reject({"status":false});
            }
            else {
               massDeleteFinalDefer.resolve({"status":true});
            }
        });
        return massDeleteFinalDefer.promise;
  }).then(function(data){mdDefer.resolve({"status":data.status});});
  return mdDefer.promise;
}


exports.select = function(filter){
  var selectDefer = Q.defer();
  //console.log(filter);
  var qjson = {
    "selector":JSON.parse(filter),
    "fields":[],
    "sort":[{"_id":"asc"}]
  };
  console.log(qjson);
    request({
          url: cred[0].url+"/"+cred[0].database+"/_find",//URL to hit
          qs: {from: 'tp fernando', time: new Date()}, //Query string data
          method: 'POST',
          json:qjson
      }, function(error, response, body){
          if(error) {
              console.log(error);
            selectDefer.reject({"status":500,"body":error});
          }
          else {
            selectDefer.resolve({"status":200,"body":body.docs});
          }
      });
      return selectDefer.promise;
}

exports.selectget = function(filter,value){
  var selectDefer = Q.defer();
  //console.log(filter);
  var interJSON = "{\""+filter+"\":\""+value+"\"}"
  var qjson = {
    "selector":JSON.parse(interJSON),
    "fields":[],
    "sort":[{"_id":"asc"}]
  };
  console.log(qjson);
    request({
          url: cred[0].url+"/"+cred[0].database+"/_find",//URL to hit
          qs: {from: 'tp fernando', time: new Date()}, //Query string data
          method: 'POST',
          json:qjson
      }, function(error, response, body){
          if(error) {
              console.log(error);
            selectDefer.reject({"status":500,"body":error});
          }
          else {
            selectDefer.resolve({"status":200,"body":body.docs});
          }
      });
      return selectDefer.promise;
}


exports.updateDoc = function(id,rev,name,city,country,telephone,email){
  var updateDefer = Q.defer();
  var qjson = {"_id":id,"_rev":rev,"NAME":name,"CITY":city,"COUNTRY":country,"TELEPHONE":telephone,"EMAIL":email};
  request({
        url: cred[0].url+"/"+cred[0].database+"/"+id,//URL to hit
        qs: {from: 'tp fernando', time: new Date()}, //Query string data
        method: 'PUT',
        json:qjson
    }, function(error, response, body){
        if(error) {
            console.log(error);
          updateDefer.reject({"status":500,"body":error});
        }
        else {
          updateDefer.resolve({"status":200,"body":body});
        }
    });
    return updateDefer.promise;
}

exports.deleteDoc = function(id,rev){
  var deleteDefer = Q.defer();

  request({
       url: cred[0].url+"/"+cred[0].database+"/"+id+"?rev="+rev,//URL to hit
       qs: {from: 'tp fernando', time: +new Date()}, //Query string data
       method: 'DELETE',
       //Lets post the following key/values as form
   }, function(error, response, body){
       if(error) {
           //console.log(error);
           deleteDefer.reject({"status":500,"body":error});
       }
       else {
           //console.log(response.statusCode, body);
           deleteDefer.resolve({"status":response.statusCode,"body":body});
       }
   });

  return deleteDefer.promise;
}

exports.insertDoc = function(name,city,country,telephone,email){
  var insertDefer = Q.defer();
  var insertJSON = {
    "NAME":name,
    "CITY":city,
    "COUNTRY":country,
    "TELEPHONE":telephone,
    "EMAIL":email
  };
  request({
       url: cred[0].url+"/"+cred[0].database,//URL to hit
       qs: {from: 'tp fernando', time: +new Date()}, //Query string data
       method: 'POST',
       json:insertJSON
       //Lets post the following key/values as form
   }, function(error, response, body){
       if(error) {
           //console.log(error);
           insertDefer.reject({"status":500,"body":error});
       }
       else {
           //console.log(response.statusCode, body);
           insertDefer.resolve({"status":response.statusCode,"body":body});
       }
   });
  return insertDefer.promise;
}


  exports.selectEveryDoc = function(){
        var seleDefer = Q.defer();
        var getQuery = {
                        "selector": {
                          "_id": {
                            "$gt": 0
                          }
                        },
                        "fields": [
                        ],
                        "sort": [
                          {
                            "_id": "asc"
                          }
                        ]
                      };
        request({
              url: cred[0].url+"/"+cred[0].database+"/_find",//URL to hit
              method: 'POST',
              json:getQuery
          }, function(error, response, body){
              if(error) {
                  console.log(error);
                  seleDefer.reject({"status":500,"body":error});
              }
              else {
                  //console.log(response.statusCode, JSON.parse(body).rows );
                  //console.log(body.docs);
                    seleDefer.resolve({"status":response.statusCode,"body":body.docs});
              }
          });
          return seleDefer.promise;
    }

    exports.insertAny = function(ajson){
      var insertDefer = Q.defer();
      var insertJSON = ajson;
      request({
           url: cred[0].url+"/"+cred[0].database,//URL to hit
           qs: {from: 'tp fernando', time: +new Date()}, //Query string data
           method: 'POST',
           json:insertJSON
           //Lets post the following key/values as form
       }, function(error, response, body){
           if(error) {
               //console.log(error);
               insertDefer.reject({"status":500,"body":error});
           }
           else {
               //console.log(response.statusCode, body);
               insertDefer.resolve({"status":response.statusCode,"body":body});
           }
       });
      return insertDefer.promise;
    }

    exports.bulkInsert = function(array){
      var bulkInsertDefer = Q.defer();
      //console.log(JSON.strigify(array));
      var insertJSON = {"docs":null};
      insertJSON.docs = array;
      console.log("array:",insertJSON);
      request({
           url: cred[0].url+"/"+cred[0].database+"/_bulk_docs",//URL to hit
           qs: {from: 'tp fernando', time: +new Date()}, //Query string data
           method: 'POST',
           json:insertJSON
           //Lets post the following key/values as form
       }, function(error, response, body){
           if(error) {
               //console.log(error);
               bulkInsertDefer.reject({"status":500,"body":error});
           }
           else {
               //console.log(response.statusCode, body);
               bulkInsertDefer.resolve({"status":response.statusCode,"body":body});
           }
       });

      return bulkInsertDefer.promise;
    }

    exports.bulkUpdate = function(array,upfield,neoValue){
      var bulkUpdateDefer = Q.defer();
      //console.log(JSON.strigify(array));
      var select = function(filter){
        var selectDefer = Q.defer();
        //console.log(filter);
        var qjson = {
          "selector":JSON.parse(filter),
          "fields":[],
          "sort":[{"_id":"asc"}]
        };
        console.log(qjson);
          request({
                url: cred[0].url+"/"+cred[0].database+"/_find",//URL to hit
                qs: {from: 'tp fernando', time: new Date()}, //Query string data
                method: 'POST',
                json:qjson
            }, function(error, response, body){
                if(error) {
                    console.log(error);
                  selectDefer.reject({"status":500,"body":error});
                }
                else {
                  selectDefer.resolve({"status":200,"body":body.docs});
                }
            });
            return selectDefer.promise;
      }


      var massUp = function(uparray){
      var insertJSON = {"docs":null};
      insertJSON.docs = uparray;
      console.log("array:",insertJSON.length);
      request({
           url: cred[0].url+"/"+cred[0].database+"/_bulk_docs",//URL to hit
           qs: {from: 'tp fernando', time: +new Date()}, //Query string data
           method: 'POST',
           json:insertJSON
           //Lets post the following key/values as form
       }, function(error, response, body){
           if(error) {
               //console.log(error);
               bulkUpdateDefer.reject({"status":500,"body":error});
           }
           else {
               //console.log(response.statusCode, body);
               bulkUpdateDefer.resolve({"status":response.statusCode,"body":body});
           }
       });
     }

     select(array)
     .then(function(data){
       console.log("Size of UPDATE:",data.body.length);
       var interPromise = Q.defer();
       var neededInfo = data.body;
       var finalArray = neededInfo;
       for(var i=0;i<neededInfo.length;i++){
         console.log("Updating "+ upfield+ ":" + finalArray[i][upfield] + " to " + neoValue);
         finalArray[i][upfield] = neoValue;

         if((i+1)==(neededInfo.length)){
           interPromise.resolve({"status":true,"body":finalArray});
         }
       }
       return interPromise.promise;
     })
     .then(function(data){
       console.log(data.body);
       massUp(data.body);
     });


      return bulkUpdateDefer.promise;
    }
