import { Address, ethereum } from "@graphprotocol/graph-ts";
import { afterAll, beforeAll, clearStore, createMockedFunction, describe, newMockCall, test } from "matchstick-as";
import { createCauldron } from  "../../src/helpers/cauldron/create-cauldron";
import { CLONE_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, DATA, COLLATERAL_ADDRESS, COLLATERAL_DECIMALS, COLLATERAL_NAME, COLLATERAL_SYMBOL, MOCK_ACCOUNT} from "../constants";
import { handleBorrowCall } from "../../src/mappings/cauldron";
import { BorrowCall } from "../../generated/templates/Cauldron/Cauldron";

describe("Mock contract functions", () => {
    beforeAll(() => {
        // Create collateral mock functions
        createMockedFunction(COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);

        createCauldron(CLONE_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, DATA);
    });

    afterAll(() => {
        clearStore();
    });

    test('Can get fee from borrow call', () => {
        const call: BorrowCall = changetype<BorrowCall>(newMockCall())
        call.to = CLONE_ADDRESS;
        call.inputValues = [new ethereum.EventParam("to", ethereum.Value.fromAddress(MOCK_ACCOUNT)), new ethereum.EventParam("amount", ethereum.Value.fromI32(1000000))];
        
        handleBorrowCall(call);
    });
});