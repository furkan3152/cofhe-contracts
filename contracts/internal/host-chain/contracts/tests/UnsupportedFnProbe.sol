// SPDX-License-Identifier: MIT
pragma solidity >=0.8.25 <0.9.0;

import {FHE, euint8, Common} from "@fhenixprotocol/cofhe-contracts/FHE.sol";
import {FunctionId} from "@fhenixprotocol/cofhe-contracts/ICofhe.sol";

/// @notice Submits a two-operand euint8 task with an arbitrary FunctionId, creating the operands
///         in the same transaction so the TaskManager's transient grants on them still hold.
contract UnsupportedFnProbe {
    function run(uint8 funcId) external returns (uint256) {
        uint256[] memory operands = new uint256[](2);
        operands[0] = uint256(euint8.unwrap(FHE.asEuint8(1)));
        operands[1] = uint256(euint8.unwrap(FHE.asEuint8(2)));
        return Common.tm().createTask(2, FunctionId(funcId), operands, new uint256[](0));
    }
}
