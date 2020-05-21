import { mount } from 'enzyme';
import Router from 'next/router';
import { useDispatch } from 'react-redux';

import Signin from '../Signin';

jest.mock('next/router', () => ({ push: jest.fn() }), { virtual: true });

jest.mock('react-redux', () => {
  const originalReactRedux = jest.requireActual('react-redux');
  const mDispatch = jest.fn();
  const mUseDispatch = jest.fn(() => mDispatch);
  return {
    ...originalReactRedux,
    useDispatch: mUseDispatch,
  };
});

describe('Signin Section', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should pass without using mock store', () => {
      const wrapper = mount(<Signin />);
      expect(wrapper).toBeTruthy();
      
      expect(useDispatch).toBeCalledTimes(1);

      const onSubmitFn = jest.fn();
      const wrapper1 = mount(<Form onSubmit={onSubmitFn}/>);
      const form = wrapper1.find('form');
      form.simulate('submit');
      expect(onSubmitFn).toHaveBeenCalledTimes(1);
    });
  });
