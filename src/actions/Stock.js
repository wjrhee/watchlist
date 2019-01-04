import _ from 'lodash';
import { url } from '../config/constants';

export const LOAD_CHART = 'LOAD_CHART';
export const RECEIVED_CHART = 'RECEIVED_CHART';

export const fetchChart = (ticker) => {
  return async (dispatch) => {
    dispatch({ type: LOAD_CHART });
    const rawData = await fetch(`${url.iex.base}/${ticker}/chart/1m`);
    const chartData = await rawData.json();
    const chart = chartData.map(({ date, vwap }) => ({ date, vwap }))

    return dispatch({
      type: RECEIVED_CHART,
      chart
    });
  };
};
