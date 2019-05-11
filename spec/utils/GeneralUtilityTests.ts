import { delay } from "../../lib/utils/GeneralUtility";
import { origTimeout } from "../test_utils/UiUtils";

describe('GeneralUtility', () => {
    describe('delay', () => {
        it('returns promise', () => {
            const retVal = delay(1000);
            expect(retVal).toBeDefined();
            expect(retVal).toBeInstanceOf(Promise);
        });

        it('sets timeout for expected duration', async () => {
            window.setTimeout = jest.fn((res, time) => res());
            await delay(1234);
            expect(window.setTimeout).toHaveBeenCalledTimes(1);
            expect(window.setTimeout).toHaveBeenCalledWith(expect.anything(), 1234);
            window.setTimeout = origTimeout;
        });
    })
})