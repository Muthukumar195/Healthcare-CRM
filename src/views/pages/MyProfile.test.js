import React from 'react'
import ReactDOM from 'react-dom'
import MyProfile from './MyProfile'
import { shallow, mount, type, ReactWrapper } from 'enzyme';
import { store, findByTestAtrr } from '../../components';
import { Formik, Field, Form, ErrorMessage, Errors } from "formik";

const setUp = (initialState = {}) => {
	var states = store.getState();
	states.auth.login.login.user = { "_id": "5f26494acafede18e418720e", "prefix": "Dr", "firstName": "Muthull", "lastName": "kumarll", "suffix": "K", "fullName": "Muthull kumarll", "userRole": "admin", "email": "muthu.dev@velaninfo.com", "gender": null, "mobile": "7897987987", "dateOfBirth": null, "profileImage": "5f26494acafede18e418720e.png" }
	const wrapper = shallow(<MyProfile store={store} />).childAt(0).dive();
	//console.log(wrapper.debug())
	return wrapper;
};

describe('MyProfile', () => {
	let component;
	beforeEach(() => {
		component = setUp();
	});

	test('Reset Password form field count and input name', () => {
		expect(component.find(Formik).dive().find(Field)).toHaveLength(5);
		expect(component.find(Formik).dive().find(Field).at(0).props().name).toEqual("prefix")
		expect(component.find(Formik).dive().find(Field).at(1).props().name).toEqual("firstName")
		expect(component.find(Formik).dive().find(Field).at(2).props().name).toEqual("lastName")
		expect(component.find(Formik).dive().find(Field).at(3).props().name).toEqual("suffix")
		expect(component.find(Formik).dive().find(Field).at(4).props().name).toEqual("email")
	});
}); 