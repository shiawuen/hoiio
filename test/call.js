
/**
 * dependencies
 */

var hoiio = require('../index')
  , should = require('should');


/**
 * setup for API calls
 */

hoiio.setup(process.env.APPID, process.env.ACCESSTOKEN)

/**
 * Tests for call API
 */

describe('#call', function(){
  it('should make call to dest2', function(done){
    hoiio
    .call()
    .end(function(res){
      should.exist(res)
      should.exist(res.body)

      console.log('will fail')
      should.ok('success_ok' == res.body.status)
      // TODO: more checks

      done()
    })
  })
})

/**
 * Tests for call history API
 */

describe('#call("history")', function(){
  it('should get all call histories', function(done){
    hoiio
    .call('history')
    .end(function(res){
      should.exist(res)
      should.exist(res.body)

      should.ok('success_ok' == res.body.status)
      // TOOD: more checks

      done()
    })
  })
})

/**
 * Tests for call rate API
 */

describe('#call("rate")', function(){
  it('should get call rate for dest1 to dest2', function(done){
    hoiio
    .call('rate')
    .set({dest1: '+6591111111', dest2: '+60171111111'})
    .end(function(res){
      should.exist(res)
      should.exist(res.body)

      should.ok('success_ok' == res.body.status)
      // TODO: more checks

      done()
    })
  })
})

/**
 * Test for call status API
 */

describe('#call("status")', function(){
  it('should get status of call', function(done){
    hoiio
    .call('status')
    .set({ txn_ref: 'AA-C-3280962' })
    .end(function(res){
      should.exist(res)
      should.exist(res.body)

      should.ok('success_ok' == res.body.status)

      done()
    })
  })
})

/**
 * Tests for conference call API
 */

describe('#call("conference")', function(){
  it('should call destinations given', function(done){
    hoiio
    .call('conference')
    .end(function(res){
      should.exist(res)
      should.exist(res.body)

      console.log('will fail');
      should.ok('success_ok' == res.body.status)
      // TODO: more checks

      done()
    })
  })
})