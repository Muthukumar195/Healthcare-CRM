import React from 'react'
import ReactDOM from 'react-dom'
import ForgotPassword from './ForgotPassword'
import { shallow, mount, type, ReactWrapper  } from 'enzyme'; 
import { store, findByTestAtrr } from '../../components';  
import { Formik, Field, Form, ErrorMessage, Errors } from "formik";  
//import { store } from '../../redux/storeConfig/store'; 
 
const setUp = (initialState={}) => { 
    const wrapper = shallow(<ForgotPassword store={store} />).childAt(0).dive() ; 
    return wrapper;
}; 

describe('ForgotPassword', () => {
	let component;
    beforeEach(() => {
        component = setUp(); 
    }); 
	test('Forgot Password form field count and input name', () => {
      expect(component.find(Formik).dive().find(Field)).toHaveLength(1);   
	  expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("email") 
	}); 
}); 