import { registerBidder } from "../src/adapters/bidderFactory.js";
import { BANNER } from "../src/mediaTypes.js";
import { deepAccess, parseSizesInput } from "../src/utils.js";

const BIDDER_CODE = "piekharieva";
const AUCTION_PATH = "/auction/";
const PROTOCOL = "https://";
const HOST = "intern-news-server.onrender.com";

function getUri() {
  return PROTOCOL + HOST + AUCTION_PATH;
}

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid: function (bid) {
    return !!(bid.params && bid.params.aid);
  },

  buildRequests: function (bidRequests, adapterRequest) {
    const bids = bidRequests.map((bid) => prepareBidRequest(bid));

    return {
      method: "POST",
      url: getUri(),
      data: {
        bids: bids,
      },
      adapterRequest,
    };
  },

  interpretResponse: function (serverResponse, { adapterRequest }) {
    try {
      const response = serverResponse.body;

      if (!response || !response.body || !Array.isArray(response.body.bids)) {
        return [];
      }

      return response.body.bids
        .map((serverBid) => {
          const matchingBidRequest = adapterRequest.bids.find(
            (bid) => bid.bidId === serverBid.requestId
          );

          if (!matchingBidRequest) {
            return [];
          }

          if (serverBid.cpm <= 0) {
            return [];
          }

          return createBid(serverBid, matchingBidRequest);
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  },
};

function prepareBidRequest(bid) {
  const sizes = deepAccess(bid, "mediaTypes.banner.sizes");

  return {
    requestId: bid.bidId,
    aid: bid.params.aid,
    sizes: parseSizesInput(sizes),
    placementId: bid.adUnitCode,
  };
}

function createBid(serverBid, bidRequest) {
  return {
    requestId: serverBid.requestId,
    cpm: serverBid.cpm,
    width: serverBid.width,
    height: serverBid.height,
    creativeId: serverBid.creativeId || serverBid.requestId,
    currency: serverBid.currency || "USD",
    netRevenue: true,
    ttl: 300,
    mediaType: "banner",
    ad: serverBid.ad || "",
  };
}

registerBidder(spec);
