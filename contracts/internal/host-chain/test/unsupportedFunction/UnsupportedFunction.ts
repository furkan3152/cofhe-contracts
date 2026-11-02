import { expect } from "chai";
import hre from "hardhat";
import { deployOnChainFixture } from "../onChain/OnChain.fixture";

const { ethers } = hre;

// FunctionId members that are not FHE task operations: the reserved slots (_0 GetNetworkKey,
// _1 Verify, _5 req, _31) and sealoutput. Like decrypt (#79), the coprocessor has nothing to
// run for them, so a task would strand its placeholder handle.
const UNSUPPORTED = [
  { id: 0, name: "_0" },
  { id: 1, name: "_1" },
  { id: 3, name: "sealoutput" },
  { id: 5, name: "_5" },
  { id: 31, name: "_31" },
];
const ADD = 8;

describe("TaskManager createTask: unsupported function ids", function () {
  let taskManager: any;
  let probe: any;

  before(async function () {
    ({ taskManager } = await deployOnChainFixture());
    probe = await (await ethers.getContractFactory("UnsupportedFnProbe")).deploy();
    await probe.waitForDeployment();
  });

  for (const { id, name } of UNSUPPORTED) {
    it(`rejects ${name} (${id})`, async function () {
      await expect(probe.run(id))
        .to.be.revertedWithCustomError(taskManager, "FunctionNotSupported")
        .withArgs(id);
    });
  }

  it("still accepts a supported binary op (add)", async function () {
    await expect(probe.run(ADD)).to.emit(taskManager, "TaskCreated");
  });
});
