# piekharieva bid adapter

## Description

Banner-only adapter for Prebid.js. It processes bid requests and interacts with a remote server to retrieve bids for the given `aid` parameter.

## Supported Media Types

- Banner

## Bid Params

| Name | Type | Description |
|------|------|-------------|
| `aid` | `string` | Required. Ad unit identifier. |

## Methods

### `isBidRequestValid(bid)`
Validates if the bid request contains the required `aid` parameter.

#### Returns:
- `boolean`: `true` if valid, `false` otherwise.

### `buildRequests(bidRequests, adapterRequest)`
Builds a POST request to send bid data to the server.

#### Returns:
- `Object`: The request object with `method`, `url`, and `data` containing bids.

### `interpretResponse(serverResponse, adapterRequest)`
Interprets the server response and maps it to Prebid bid objects.

#### Returns:
- `Array`: Array of bid objects or an empty array if the response is invalid.

## Example

```javascript
var adUnits = [{
  code: 'div-gpt-ad-12345-0',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'piekharieva',
    params: {
      aid: '123456'
    }
  }]
}];
