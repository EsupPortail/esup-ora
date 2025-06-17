import { data } from './data.js';

export const getDataForTable = (dataType) => {
    return data[dataType];
}