import { broadcast } from "../../lib/utils/BroadcastUtility";
import { setupRuntime } from "../test_utils/UiUtils";
import { runtime } from "../../lib/lib";
import Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('BroadcastUtility', () => {
    describe('broadcast', () => {
        it('calls runtime.message.broadcast with message and data', async () => {
            await setupRuntime(() => { });
            runtime.messaging.broadcast = jest.fn();
            const message = "message";
            const data = { key: 12 };
            broadcast(message, data);
            expect(runtime.messaging.broadcast).toHaveBeenCalledTimes(1);
            expect(runtime.messaging.broadcast).toHaveBeenCalledWith(message, true, data);
        });

        it('calls runtime.message.broadcast with message and default data', async () => {
            await setupRuntime(() => { });
            runtime.messaging.broadcast = jest.fn();
            const message = "message";
            broadcast(message);
            expect(runtime.messaging.broadcast).toHaveBeenCalledTimes(1);
            expect(runtime.messaging.broadcast).toHaveBeenCalledWith(message, true, undefined);
        });
    })
})