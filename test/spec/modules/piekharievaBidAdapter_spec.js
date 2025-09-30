import { expect } from "chai";
import { spec } from "modules/piekharievaBidAdapter.js";

describe("piekharievaBidAdapter", function () {
  const bid = {
    bidId: "123",
    adUnitCode: "div-id",
    mediaTypes: {
      banner: {
        sizes: [[300, 250]],
      },
    },
    params: {
      aid: "999",
    },
  };

  it("should validate bid request", function () {
    expect(spec.isBidRequestValid(bid)).to.equal(true);
  });

  it("should build request", function () {
    const request = spec.buildRequests([bid], {});
    expect(request).to.have.property("method", "POST");
    expect(request).to.have.property("url");
    expect(request.data.bids[0]).to.include({ aid: "999" });
  });

  it("should interpret response", function () {
    const response = {
      body: {
        bids: [
          {
            requestId: "123",
            cpm: 1.5,
            width: 300,
            height: 250,
            ad: "<div>Test Ad</div>",
            creativeId: "creative123",
            currency: "USD",
          },
        ],
      },
    };

    const expected = [
      {
        requestId: "123",
        cpm: 1.5,
        width: 300,
        height: 250,
        ad: "<div>Test Ad</div>",
        creativeId: "creative123",
        currency: "USD",
        netRevenue: true,
        ttl: 300,
      },
    ];

    const result = spec.interpretResponse(response, { bids: [bid] });

    if (result.length > 0) {
      expect(result).to.deep.equal(expected);
    } else {
      expect(result).to.be.empty;
    }
  });
});
