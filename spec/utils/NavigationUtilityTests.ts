/**
 * @jest-environment jsdom
 */

import { navigate } from "../../lib/utils/NavigationUtility";
import { setupRuntime } from "../test_utils/UiUtils";
import { runtime } from "../../lib/lib";

describe('NavigationUtility', () => {
    describe('navigate', () => {
        it('calls runtime.ui.navigate with url', async () => {
            await setupRuntime(() => { });
            runtime.ui.navigate = jest.fn();
            const url = "someUrl";
            navigate(url);
            expect(runtime.ui.navigate).toHaveBeenCalledTimes(1);
            expect(runtime.ui.navigate).toHaveBeenCalledWith(url);
        });
    })
})