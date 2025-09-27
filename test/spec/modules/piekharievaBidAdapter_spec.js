import { expect } from 'chai';
import { spec } from 'modules/piekharievaBidAdapter.js';

describe('piekharievaBidAdapter', function () {
  const bid = {
    bidId: '123',
    adUnitCode: 'div-id',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    params: {
      aid: '999'
    }
  };

  it('should validate bid request', function () {
    expect(spec.isBidRequestValid(bid)).to.equal(true);
  });

  it('should build request', function () {
    const request = spec.buildRequests([bid], {});
    expect(request).to.have.property('method', 'POST');
    expect(request).to.have.property('url');
    expect(request.data.bids[0]).to.include({aid: '999'});
  });

  it('should interpret response', function () {
    const response = {
      body: {
        bids: [{
          requestId: '123',
          cpm: 1.5,
          width: 300,
          height: 250,
          ad: '<div>Test Ad</div>',
          creativeId: 'creative123',
          currency: 'USD'
        }]
      }
    };

    const result = spec.interpretResponse(response, { bids: [bid] });

    expect(result).to.be.an('array');

    if (result.length > 0) {
      expect(result[0]).to.include({ cpm: 1.5, width: 300, height: 250 });
      expect(result[0].ad).to.equal('<div>Test Ad</div>');
      expect(result[0]).to.have.property('requestId').that.equals('123');
      expect(result[0]).to.have.property('creativeId').that.equals('creative123');
      expect(result[0]).to.have.property('currency').that.equals('USD');
      expect(result[0]).to.have.property('netRevenue').that.equals(true);
      expect(result[0]).to.have.property('ttl').that.equals(300);
    } else {
      expect(result).to.be.empty;
    }
  });
});
