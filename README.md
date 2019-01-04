# Watch List

## Installation
```bash
npm install -g expo-cli
npm install
```

##  Running
```bash
npm run android
```

## Using Android Studio Android Virtual Device
- Recommended API Level
  - 28


## Notes
This is a little rough around the edges, especially the styling.  The primary focus was not on
aesthetics, but to get the app in a presentable state.
The idea with the stock and watch list modeling was that stocks would be lazy loaded into the
application and duplicates wouldn't be created.  The stocks being watched on a watch list represent
the link between a watch list and a stock.
The stock data (ask price, bid price, chart data, etc.) should have been linked to the stock,
rather than existing as an extra outside object.
