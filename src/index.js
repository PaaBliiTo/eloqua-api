var request = require('request');
var async = require('async');

function Eloqua(pod, site, username, password) {
	this.baseUrl = 'https://secure.'+pod+'.eloqua.com';
  this.credential = Buffer.from(site + "\\" + username + ":" + password).toString('base64')
}

Eloqua.prototype.request = function(url, options, callback) {
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

Eloqua.prototype.get = function(uri, callback) {
	this.request(uri, null, callback);
};

Eloqua.prototype.put = function(uri, data, callback) {
	this.request(uri, { method: "PUT", body: data }, callback);
};

Eloqua.prototype.post = function(uri, data, callback) {
	this.request(uri, { method : "POST", body: data }, callback);
};

Eloqua.prototype.delete = function(uri, callback) {
	this.request(uri, { method: "DELETE" }, callback);
};

/* ACCOUNT FUNCTIONS */

Eloqua.prototype.createAccounts = function(data, callback) {

  // Check of the data parameter
  if(typeof data === 'undefined' || !data.length || !data.every(function(i){ return (typeof i ==='object')})) {
    let e = new Error("data must be an object");
    throw e;
  }
  for(i in data){
    if(!("name" in data[i])){
      let e = new Error("\"name\" property cannot be null")
      throw e;
    }
  }

  // Builds the url
  let url = "/api/REST/1.0/data/account";

  // Makes a call for every data provided, then builds the response and pass it in the callback

  async.map(data, (acc, cb) => {
    this.post(url, acc, (e,r) => {
      if(e) throw e;
      if(r) {
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

Eloqua.prototype.getAccounts = function(ids, callback) {

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
    if(e) throw e;
    var f = res.filter(function (el) {
      return el != null;
    });
    callback(f);
  })
}

Eloqua.prototype.searchAccounts = function(criteria, field, complete, callback) {

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

      // Checks if some results are on other pages and calculates the number of total pages
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }

        // Get all the different pages and build the x variable
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
          if(e) throw e;
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

Eloqua.prototype.getAllAccounts = function(callback) {

  // Builds the URL
  let url = "/api/REST/1.0/data/accounts";
  this.get(url, (e,r) => {
    if(e) throw e;
    if(r) {

      // x is the object that will be returned in the callback
      let x = {};
      x.elements = r.elements;
      x.total = r.total;

      // Checks if some results are on other pages and calculates the number of total pages
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }

        // Get all the different pages and build the x variable
        async.map(p, (k, cb) => {
          this.get(url + "?page=" + k, (e,r) => {
            if(e) throw e;
            if(r) {
              cb(null, r.elements)
            }
            else {
              cb(null)
            }
          })
        }, (e, res) => {
          if(e) throw e;
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

Eloqua.prototype.deleteAccounts = function(ids, callback) {
  // Check of the ids parameter
  if(typeof ids === 'undefined' || !ids.length || !ids.every(function(i){ return Number.isInteger(i) })) {
    let e = new Error("ids must be an array of integers");
    throw e;
  }
  
  // Makes a call for every id provided, then deletes the accounts
  async.map(ids, (id, cb) => {
    this.delete("/api/REST/1.0/data/account/" + id, (e,r) => {
      if(e) throw e;
      if(r){
        cb(null, r)
      }
    })
  }, (e, res) => {
    if(e) throw e;
    callback();
  })
}





/* CONTACT FUNCTIONS */

Eloqua.prototype.createContacts = function(data, callback) {

  // Check of the data parameter
  if(typeof data === 'undefined' || !data.length || !data.every(function(i){ return (typeof i ==='object')})) {
    let e = new Error("data must be an object");
    throw e;
  }
  for(i in data){
    if(!("emailAddress" in data[i])){
      let e = new Error("\"emailAddress\" property cannot be null")
      throw e;
    }
  }

  // Builds the url
  let url = "/api/REST/1.0/data/contact";

  // Makes a call for every data provided, then builds the response and pass it in the callback

  async.map(data, (acc, cb) => {
    this.post(url, acc, (e,r) => {
      if(e) throw e;
      if(r) {
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

Eloqua.prototype.getContacts = function(ids, callback) {
  // Check of the ids parameter
  if(typeof ids === 'undefined' || !ids.length || !ids.every(function(i){ return Number.isInteger(i) })) {
    let e = new Error("ids must be an array of integers");
    throw e;
  }
  
  // Makes a call for every id provided, then builds the response and pass it in the callback
  async.map(ids, (id, cb) => {
    this.get("/api/REST/1.0/data/contact/" + id, (e,r) => {
      if(e) throw e;
      if(r){
        cb(null, r)
      }
      else{
        cb(null)
      }
    })
  }, (e, res) => {
    if(e) throw e;
    var f = res.filter(function (el) {
      return el != null;
    });
    callback(f);
  })
}

Eloqua.prototype.searchContacts = function(criteria, field, complete, callback) {

  // Criteria parameter check
  if(typeof criteria !== 'string'){
    let e = new Error("criteria must be a string");
    throw e;
  }

  // Builds the URL depending on the input parameters
  let url = "/api/REST/1.0/data/contacts?search=" + (typeof field === 'string' ? field + "=" : "") + criteria + "&depth=" + (typeof complete === 'boolean' && complete ? "complete" : "minimal")

  this.get(url, (e,r) => {
    if(e) throw e;
    if(r) {

      // x is the object that will be returned in the callback
      let x = {};
      x.elements = r.elements;
      x.total = r.total;

      // Checks if some results are on other pages and calculates the number of total pages
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }

        // Get all the different pages and build the x variable
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
          if(e) throw e;
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

Eloqua.prototype.getAllContacts = function(callback) {

  // Builds the URL
  let url = "/api/REST/1.0/data/contacts";
  this.get(url, (e,r) => {
    if(e) throw e;
    if(r) {

      // x is the object that will be returned in the callback
      let x = {};
      x.elements = r.elements;
      x.total = r.total;

      // Checks if some results are on other pages and calculates the number of total pages
      if(r.total > r.page * r.pageSize){
        let np = r.total / r.pageSize
        if(!Number.isInteger(np)){
          np = Math.trunc(np) + 1
        }
        let p = [];
        for(i=1; i < np; i++){
          p.push(i+1)
        }

        // Get all the different pages and build the x variable before passing it in the callback
        async.map(p, (k, cb) => {
          this.get(url + "?page=" + k, (e,r) => {
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
            if(e) throw e;
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

Eloqua.prototype.deleteContacts = function(ids, callback) {
  // Check of the ids parameter
  if(typeof ids === 'undefined' || !ids.length || !ids.every(function(i){ return Number.isInteger(i) })) {
    let e = new Error("ids must be an array of integers");
    throw e;
  }
  
  // Makes a call for every id provided, then deletes the contact
  async.map(ids, (id, cb) => {
    this.delete("/api/REST/1.0/data/contact/" + id, (e,r) => {
      if(e) throw e;
      cb(null)
    })
  }, (e, res) => {
    if(e) throw e;
    callback();
  })
}

module.exports = Eloqua;