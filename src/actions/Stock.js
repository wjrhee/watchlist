import _ from 'lodash';

export const LOAD_CHART = 'LOAD_CHART';
export const RECEIVED_CHART = 'RECEIVED_CHART';

const baseUrl = 'https://api.iextrading.com/1.0/stock';

export const fetchChart = (ticker) => {
  return (dispatch) => {
    dispatch({ type: LOAD_CHART });
    return fetch(`${baseUrl}/${ticker}/chart/1m`)
      .then((item) => item.json())
      .then((chartData) => {
        const chart = chartData.map(({ date, vwap }) => ({ date, vwap }))

        return dispatch({
          type: RECEIVED_CHART,
          chart
        });
      });
  };
};
