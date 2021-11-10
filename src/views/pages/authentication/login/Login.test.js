import React from 'react'
import ReactDOM from 'react-dom'
import Login from './Login'
import { shallow, mount, type, ReactWrapper  } from 'enzyme'; 
import { store } from '../../../../redux/storeConfig/store';  
import { Formik, Field, Form, ErrorMessage, Errors } from "formik";  
 
const setUp = (initialState={}) => { 
    const wrapper = shallow(<Login store={store} />).childAt(0).dive() ; 
    return wrapper;
};
const findByTestAtrr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
}; 

/* describe('Login Component', () => { 
    let component;
    beforeEach(() => {
        component = setUp(); 
    }); 
    it('Should render without errors', () => {
        const wrapper = findByTestAtrr(component, 'headerComponent');
        expect(wrapper.length).toBe(1);
    });

    it('Should render a logo', () => {
        const logo = findByTestAtrr(component, 'logoIMG');
        expect(logo.length).toBe(1);
    }); 
});  */

describe('Login', () => {
	let component;
    beforeEach(() => {
        component = setUp(); 
    }); 
	test('Login form field count and input name', () => {
      expect(component.find(Formik).dive().find(Field)).toHaveLength(2);   
	  expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("username")
	  expect(component.find(Formik).dive().find(Field).at(1).props().name).toEqual("password")  
	}); 
}); 