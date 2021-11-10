import React from 'react'
import ReactDOM from 'react-dom'
import ChangePassword from './ChangePassword'
import { shallow, mount, type, ReactWrapper } from 'enzyme';
import { store, findByTestAtrr } from '../../components';
import { Formik, Field, Form, ErrorMessage, Errors } from "formik";

const setUp = (initialState = {}) => {
	var states = store.getState();
	states.auth.login.login.user = { _id: "dsd" }
	const wrapper = shallow(<ChangePassword store={store} />).childAt(0).dive();
	//console.log(wrapper.debug())
	return wrapper;
};

	describe('ChangePassword', () => {
	let component;
	beforeEach(() => {
		component = setUp();
	});

	test('Change Password form field count and input name', () => {
		expect(component.find(Formik).dive().find(Field)).toHaveLength(3);
		expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("oldPassword")
		expect(component.find(Formik).dive().find(Field).at(1).props().name).toEqual("password")
		expect(component.find(Formik).dive().find(Field).at(2).props().name).toEqual("confirmPassword") 
	});
}); 