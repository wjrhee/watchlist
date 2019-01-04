import _ from 'lodash';
import React from 'react';
import { Text } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';

const StockChart = ({ data }) => {
  if (data) {
    const xLabelFormat = (tick, i) => {
      if (i === 0 || i === 20) {
        return tick;
      };
    };

    const yLabelFormat = (tick) => `$${tick}`;

    const chartStyle = {
      data: { stroke: '#C43a31' },
      parent: { border: "1px solid #CCC"}
    };

    const yMax = _.max(_.map(data, 'vwap'));
    const yMin = _.min(_.map(data, 'vwap'));
    const buffer = (yMax - yMin) / 10

    return (
      <VictoryChart
        theme={ VictoryTheme.grayscale }
        domain={{ y: [yMin - buffer, yMax + buffer] }}
      >
        <VictoryAxis
          dependentAxis={ true }
          tickFormat={ yLabelFormat }
        />
        <VictoryAxis tickFormat={ xLabelFormat }/>
        <VictoryLine
          x={ "date" }
          y={ "vwap" }
          style={ chartStyle }
          data={ data }
        />
      </VictoryChart>
    );
  } else {
    return (<Text>loading</Text>);
  }
}

export default StockChart;
