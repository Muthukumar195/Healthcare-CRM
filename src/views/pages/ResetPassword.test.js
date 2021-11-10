import React from 'react'
import ReactDOM from 'react-dom'
import ResetPassword from './ResetPassword'
import { shallow, mount, type, ReactWrapper  } from 'enzyme'; 
import { store, findByTestAtrr } from '../../components';  
import { Formik, Field, Form, ErrorMessage, Errors } from "formik";  
 
const setUp = (initialState={}) => { 
    const wrapper = shallow(<ResetPassword store={store} />).childAt(0).dive() ; 
    return wrapper;
}; 

describe('ResetPassword', () => {
	let component;
    beforeEach(() => {
        component = setUp();    
    }); 
	test('Reset Password form field count and input name', () => {
      expect(component.find(Formik).dive().find(Field)).toHaveLength(2);   
	  expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("new_password") 
	  expect(component.find(Formik).dive().find(Field).at(1).props().name).toEqual("retype_password") 
	}); 
}); 