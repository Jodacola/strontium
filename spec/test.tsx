import React from "react";
import ReactDOM from "react-dom";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('component', () => {
    test('renders correctly', () => {
        const component = Enzyme.shallow(<div><p className="test"></p></div>);
        expect(component.find('.test')).toHaveLength(1);
    });
});
