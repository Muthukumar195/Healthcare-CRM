import {login, INIT_STATE} from './loginReducer'; 
import {login as loginAction, forgotPassword, resetPassword } from '../../actions/auth/loginActions';  

import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { spy } from 'sinon';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares); 

describe('login actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });
  it('should create login action', () => {  
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { message: 'success', status: '200' },
      });
    });
    const expectedActions = { message: 'success', status: '200' };
    const store = mockStore({ auth: {} });    
   return store.dispatch(loginAction()).then(() => {   
      expect(store.getActions()[0].result).toEqual(expectedActions);  
	   const newState = login(undefined,  store.getActions()[0]);
		  INIT_STATE.login =  { message: 'success', status: '200' }
		  INIT_STATE.userRole = "admin"
        expect(newState).toEqual(INIT_STATE); 
	  
    });  
  });
  it('Should return login state', () => {
        const newState = login(undefined,  { type: 'LOGIN',
          loading: false,
          result: { message: 'success', status: '200' },
          error: undefined });
		  INIT_STATE.login =  { message: 'success', status: '200' }
		  INIT_STATE.userRole = "admin"
        expect(newState).toEqual(INIT_STATE);
    });
  it('should create forgot password action', () => {  
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { message: 'success', status: '200' },
      });
    });
    const expectedActions = { message: 'success', status: '200' };
    const store = mockStore({ auth: {} });    
   return store.dispatch(forgotPassword()).then(() => {   
      expect(store.getActions()[0].result).toEqual(expectedActions);  
	   const newState = login(undefined,  store.getActions()[0]);
		  INIT_STATE.forgotPassword =  { message: 'success', status: '200' }
		  INIT_STATE.userRole = "admin"
        expect(newState).toEqual(INIT_STATE); 
	  
    });  
  });
  it('should create reset password action', () => {  
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { message: 'success', status: '200' },
      });
    });
    const expectedActions = { message: 'success', status: '200' };
    const store = mockStore({ auth: {} });    
   return store.dispatch(resetPassword()).then(() => {   
      expect(store.getActions()[0].result).toEqual(expectedActions);  
	   const newState = login(undefined,  store.getActions()[0]);
		  INIT_STATE.resetPassword =  { message: 'success', status: '200' }
		  INIT_STATE.userRole = "admin"
        expect(newState).toEqual(INIT_STATE); 
	  
    });  
  }); 
});