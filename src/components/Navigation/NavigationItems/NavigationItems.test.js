import React from 'react';
import { configure , shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationIems from './NavigationItems';
import NavigationIem from './NavigationItem/NavigationItem'
configure({adapter : new Adapter()});
describe('<NavigationIems />',()=> {
    let wrapper;
    beforeEach(()=>{
        wrapper=shallow(<NavigationIems />);
    })
    it('should render two <NavigationItems /> elements if not authenticated',()=>{
        expect(wrapper.find(NavigationIem)).toHaveLength(2);
    });
    it('should render three <NavigationItems /> elements if  authenticated',()=>{
         //wrapper = shallow(<NavigationIems isAuthenticated />);
         wrapper.setProps({isAuthenticated:true});
        expect(wrapper.find(NavigationIem)).toHaveLength(3);
    });
    it('should render three <NavigationItems /> elements if  authenticated',()=>{
        wrapper.setProps({isAuthenticated:true}); 
       expect(wrapper.contains(<NavigationIem link='/logout'>Logout</NavigationIem>)).toEqual(true);
   });
})