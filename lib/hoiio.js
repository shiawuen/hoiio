
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
   * Generate URL for SMS API call
   *
   * @param {String} type
   * @return {Hoiio}
   */

  hoiio.sms = function(type){
    var uri = 'voice/';

    // default action
    type || (type = 'call');

    /**
     * Rewrite type for URL generated
     */

    switch (type) {
      case 'bulk'   : type = 'bulk_send';    break;
      case 'history': type = 'get_history';  break;
      case 'rate'   : type = 'get_rate';     break;
      case 'status' : type = 'query_status'; break;
      // no default
    }

    uri += type;

    return new Hoiio(uri);
  };

  /**
   * Generate URL for Fax API call
   *
   * @param {String} type
   * @return {Hoiio}
   * @api public
   */

  hoiio.fax = function(type){
    
  };

  /**
   * Generate URL for IVR API call
   *
   * @param {String} type
   * @return {Hoiio}
   */

  hoiio.ivr = function(type){
    var uri = 'ivr/';

    // default action
    type || (type = '');

    /**
     * Rewrite type for URL generated
     */

    switch (type) {
      case 'call'     : type = 'start/dial';     break;
      case 'dial'     : type = 'start/dial';     break;
      case 'ask'      : type = 'middle/gather';  break;
      case 'gather'   : type = 'middle/gather';  break;
      case 'say'      : type = 'middle/play';    break;
      case 'play'     : type = 'middle/play';    break;
      case 'record'   : type = 'middle/record';  break;
      case 'monitor'  : type = 'middle/monitor'; break;
      case 'transfer' : type = 'end/transfer';   break;
      case 'hangup'   : type = 'end/hangup';     break;
      case 'end'      : type = 'end/hangup';     break;
      // no default
    }

    uri += type;

    return new Hoiio(uri);};

  /**
   * Generate URL for Number API call
   *
   * @param {String} type
   * @return {Hoiio}
   */

  hoiio.number = function(type){
    var uri = 'number/';

    // default action
    type || (type = 'get_active');

    /**
     * Rewrite type for URL generated
     */

    switch (type) {
      case 'mine'       : type = 'get_active';        break;
      case 'owned'      : type = 'get_active';        break;
      case 'active'     : type = 'get_active';        break;
      case 'list'       : type = 'get_choices';       break;
      case 'availables' : type = 'get_choices';       break;
      case 'countries'  : type = 'get_countries';     break;
      case 'rates'      : type = 'get_rates';         break;
      case 'buy'        : type = 'subscribe';         break;
      case 'purchase'   : type = 'subscribe';         break;
      case 'subscribe'  : type = 'subscribe';         break;
      case 'extend'     : type = 'update_forwarding'; break;
      case 'update'     : type = 'update_forwarding'; break;
      case 'forward'    : type = 'update_forwarding'; break;
      // no default
    }

    uri += type;

    return new Hoiio(uri);
  };

  /**
   * Generate URL for Account API call
   *
   * @param {String} type
   * @return {Hoiio}
   */

  hoiio.account = function(type){
    var uri = 'user/';

    // default action
    type || (type = 'get_info');

    /**
     * Rewrite type for URL generated
     */

    switch (type) {
      case 'balance' : type = 'get_balance'; break;
      case 'details' : type = 'get_info';    break;
      case 'info'    : type = 'get_info';    break;
      // no default
    }

    uri += type;

    return new Hoiio(uri);
  };

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
