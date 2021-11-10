import React from 'react'
import ReactDOM from 'react-dom'
import Settings from './Settings'
import { shallow, mount, type, ReactWrapper } from 'enzyme';
import { store, findByTestAtrr } from '../../components';
import { Formik, Field, Form, ErrorMessage, Errors } from "formik"; 
import Radio from "../../components/@vuexy/radio/RadioVuexy"; 
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";

const setUp = (initialState = {}) => {
	var states = store.getState();
	states.users.getPerferences = initialState; 

	const wrapper = shallow(<Settings store={store} />).childAt(0).dive();
	//console.log(wrapper.debug())
	return wrapper;
};

	describe('Settings', () => {
	let component;
	beforeEach(() => {
		component = setUp({"status":true,"data":{"_id":"5f7b5e437f413163e9350cad","providerId":"5f26494acafede18e418720e","__v":0,"emrPreferenceId":1,"feePerVisit":null,"hasSkipPayment":true,"iframeLink":"","paymentPreferenceId":2}});
	})

	test('Settings Use OWN EMR disabled field count and input name', () => {  
		expect(component.find(Formik).dive().find(Radio)).toHaveLength(4);  
		expect(component.find(Formik).dive().find(Radio).at(0).props().name).toEqual("emrPreferenceId")
		expect(component.find(Formik).dive().find(Radio).at(1).props().name).toEqual("emrPreferenceId")
		expect(component.find(Formik).dive().find(Radio).at(2).props().name).toEqual("paymentPreferenceId")
		expect(component.find(Formik).dive().find(Radio).at(3).props().name).toEqual("paymentPreferenceId")
		expect(component.find(Formik).dive().find(Checkbox)).toHaveLength(1);
		expect(component.find(Formik).dive().find(Checkbox).at(0).props().name).toEqual("hasSkipPayment")		
	 
	});
	
	test('Settings Use OWN EMR enabled field count and input name', () => {
		component = setUp({"status":true,"data":{"_id":"5f7b5e437f413163e9350cad","providerId":"5f26494acafede18e418720e","__v":0,"emrPreferenceId":2,"feePerVisit":null,"hasSkipPayment":true,"iframeLink":"http://dsdfdf.com","paymentPreferenceId":2}});
		expect(component.find(Formik).dive().find(Field)).toHaveLength(2);   
		expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("iframeLink")
		expect(component.find(Formik).dive().find(Field).at(1).props().name).toEqual("feePerVisit")
		expect(component.find(Formik).dive().find(Checkbox)).toHaveLength(2);
		expect(component.find(Formik).dive().find(Checkbox).at(0).props().name).toEqual("hasIframeLink")		
		expect(component.find(Formik).dive().find(Checkbox).at(1).props().name).toEqual("hasSkipPayment")		
		 
	});
}); 