var assert = require("better-assert")

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert(-1 === [1,2,3].indexOf(5));
      assert(-1 === [1,2,3].indexOf(0));
    })
  })
})