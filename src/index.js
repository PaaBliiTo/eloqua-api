var request = require('request');
var async = require('async');

function EloquaAPI(pod, site, user, password) {
	this.baseUrl = 'https://secure.'+pod+'.eloqua.com';
  this.credential = Buffer.from(site + "\\" + user + ":" + password).toString('base64')
}

EloquaAPI.prototype.request = function(url, options, callback) {
	var _this = this;
	var requestOptions = { url: _this.baseUrl + url, headers: { Authorization: "Basic " + _this.credential }, json: true };
  for (var key in options) {
    var val = options[key];
    requestOptions[key] = val;
  }
  
  return request(requestOptions, function(err, response, body) {
		if (err !== null) return callback(err, null);
		if (response.statusCode !== 200 && response.statusCode !== 201) return callback({ code: response.statusCode, msg: body }, null);
    return callback(null, body);
  });
};

/* STANDARD API REQUESTS */

EloquaAPI.prototype.get = function(uri, callback) {
	this.request(uri, null, callback);
};

EloquaAPI.prototype.put = function(uri, data, callback) {
	this.request(uri, { method: "PUT", body: data }, callback);
};

EloquaAPI.prototype.post = function(uri, data, callback) {
	this.request(uri, { method : "POST", body: data }, callback);
};

EloquaAPI.prototype.delete = function(uri, callback) {
	this.request(uri, { method: "DELETE" }, callback);
};

/* ACCOUNT FUNCTIONS */

EloquaAPI.prototype.getAccounts = function(ids, callback) {

  // Check of the ids parameter
  if(typeof ids === 'undefined' || !ids.length || !ids.every(function(i){ return Number.isInteger(i) })) {
    let e = new Error("ids must be an array of integers");
    throw e;
  }
  
  // Makes a call for every id provided, then builds the response and pass it in the callback
  async.map(ids, (id, cb) => {
    this.get("/api/REST/1.0/data/account/" + id, (e,r) => {
      if(e) throw e;
      if(r){
        cb(null, r)
      }
      else{
        cb(null)
      }
    })
  }, (e, res) => {
    var f = res.filter(function (el) {
      return el != null;
    });
    callback(f);
  })
}

EloquaAPI.prototype.searchAccounts = function(criteria, field, complete, callback) {

  // Check of the criteria parameter
  if(typeof criteria !== 'string'){
    let e = new Error("criteria must be a string");
    throw e;
  }

  // Builds the URL depending on the input parameters
  let url = "/api/REST/1.0/data/accounts?search=" + (typeof field === 'string' ? field + "=" : "") + criteria + "&depth=" + (typeof complete === 'boolean' && complete ? "complete" : "minimal")
  this.get(url, (e,r) => {
    if(e) throw e;
    if(r) {

      // x is the object that will be returned in the callback
      let x = {};

      x.elements = r.elements;
      x.total = r.total;
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }
        async.map(p, (k, cb) => {
          this.get(url + "&page=" + k, (e,r) => {
            if(e) throw e;
            if(r) {
              cb(null, r.elements)
            }
            else {
              cb(null)
            }
          })
        }, (e, res) => {
          for(i in res) {
            for(k in res[i]) {
              x.elements.push(res[i][k])
            }
          }
          callback(x)
        })
      }
      else{
        callback(x);
      }
    }
  })
}

EloquaAPI.prototype.getAllAccounts = function(callback) {
  this.get("/api/REST/1.0/data/accounts", (e,r) => {
    if(e) throw e;
    if(r) {

      // x is the object that will be returned in the callback
      let x = {};

      x.elements = r.elements;
      x.total = r.total;
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }
        async.map(p, (k, cb) => {
          this.get(url + "&page=" + k, (e,r) => {
            if(e) throw e;
            if(r) {
              cb(null, r.elements)
            }
            else {
              cb(null)
            }
          })
        }, (e, res) => {
          for(i in res) {
            for(k in res[i]) {
              x.elements.push(res[i][k])
            }
          }
          callback(x)
        })
      }
      else{
        callback(x);
      }
    }
  })
}

module.exports = EloquaAPI;