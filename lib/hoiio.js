
  /**
   * dependencies
   */

  var request = require('superagent');

  /**
   * Caches
   */

  var API_URL = 'https://secure.hoiio.com/open/';
  var APP_ID = '';
  var ACCESS_TOKEN = '';

  /**
   * Check if `obj` is an object.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */

  function isObject(obj) {
    return obj === Object(obj);
  }

  /**
   * Copy from one object to another
   *
   * @param {Object} from
   * @param {Object} to
   * return {Object}
   * @api private
   */

  function copy(from, to, replace){
    for (var prop in from) {
      if ( ! replace && prop in to) {  return; }
      to[prop] = from[prop];
    }
    return to;
  }

  /**
   * Cache APP ID and Secret. so that we don't
   * have to keep setting APP ID and Secret
   * when we doing API calls
   *
   * @param {String} App ID
   * @param {String} App Secret
   * @api public
   */

  hoiio.setup = function(id, token){
    APP_ID = id;
    ACCESS_TOKEN = token;
  }

  /**
   * Generate URL for Voice API call
   *
   * @param {String} type
   * @return {Hoiio}
   * @api public
   */

  hoiio.call = function(type){
    var uri = 'voice/';

    // default action
    type || (type = 'call');

    /**
     * Rewrite type for URL generated
     */

    switch (type) {
      case 'history': type = 'get_history';  break;
      case 'rate'   : type = 'get_rate';     break;
      case 'status' : type = 'query_status'; break;
      // no default
    }

    uri += type;

    return new Hoiio(uri);
  };

  /**
   * @api public
   */

  hoiio.sms = function(type){};

  /**
   * @api public
   */

  hoiio.fax = function(type){};

  /**
   * @api public
   */

  hoiio.ivr = function(type){};

  /**
   * @api public
   */

  hoiio.number = function(type){};

  /**
   * @api public
   */

  hoiio.account = function(type){};

  /**
   * Initialize a new instance of "Hoiio"
   *
   * @param {String} api uri
   * @param {Object} parameters
   * @param {Function} callback
   * @api public
   */

  function Hoiio(uri, params, callback){
    this.uri = uri;
    this.params = params || {};

    if ('function' == typeof callback) {
      this.end(callback);
    }
  }

  /**
   * Set parameters to API calls
   *
   * @param {String|Object} name or parameters
   * @param {String|Number} value
   * @return {Hoiio}
   * @api public
   */

  Hoiio.prototype.set = function(name, value){
    if (isObject(name)) {
      for (var n in name) {
        this.set(n, name[n]);
      }
    } else {
      this.params[name] = value;
    }

    return this;
  }

  /**
   * Dispatch request to Hoiio
   *
   * @param {Function} callback
   * @return Hoiio
   * @api public
   */

  Hoiio.prototype.end = function(callback){
    var params = copy(this.params, {});
    var noCredentials = ! (this.params.app_id && this.params.access_token);

    if (noCredentials && APP_ID && ACCESS_TOKEN) {
      params.app_id = APP_ID;
      params.access_token = ACCESS_TOKEN;
    }

    request
      .post(API_URL + this.uri)
      .type('form')
      .send(params)
      .end(function(res){
        // TOOD: handle errors

        callback(res);
      });

    return this;
  }

  /**
   * Root of the API wrapper
   */

  function hoiio(){ return hoiio; }

  /**
   * Expose API
   */

  module.exports = hoiio;
