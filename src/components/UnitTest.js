import React from 'react';
import { store } from '../redux/storeConfig/store'; 
const findByTestAtrr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}; 

  

export { findByTestAtrr, store }