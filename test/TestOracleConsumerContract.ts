import { expect } from "chai";
import { type Contract, type Event } from "ethers";
import { ethers } from "hardhat";
import { execSync } from "child_process";

async function waitForResponse(consumer: Contract, event: Event) {
  const [, data] = event.args!;
  // Run Phat Function
  const result = execSync(`phat-fn run --json dist/index.js -a ${data} https://api-v2-mumbai-live.lens.dev/`).toString();
  const json = JSON.parse(result);
  const action = ethers.utils.hexlify(ethers.utils.concat([
    new Uint8Array([0]),
    json.output,
  ]));
  // Make a response
  const tx = await consumer.rollupU256CondEq(
    // cond
    [],
    [],
    // updates
    [],
    [],
    // actions
    [action],
  );
  const receipt = await tx.wait();
  return receipt.events;
}

describe("OracleConsumerContract.sol", function () {
  it("Push and receive message", async function () {
    // Deploy the contract
    const [deployer] = await ethers.getSigners();
    const TestOracleConsumerContract = await ethers.getContractFactory("OracleConsumerContract");
    const consumer = await TestOracleConsumerContract.deploy(deployer.address);

    // Make a request
    const profileId = "0x01";
    const tx = await consumer.request(profileId);
    const receipt = await tx.wait();
    const reqEvents = receipt.events;
    expect(reqEvents![0]).to.have.property("event", "MessageQueued");

    // Wait for Phat Contract response
    const respEvents = await waitForResponse(consumer, reqEvents![0])

    // Check response data
    expect(respEvents[0]).to.have.property("event", "ResponseReceived");
    const [reqId, pair, value] = respEvents[0].args;
    expect(ethers.BigNumber.isBigNumber(reqId)).to.be.true;
    expect(pair).to.equal(profileId);
    expect(ethers.BigNumber.isBigNumber(value)).to.be.true;
  });
});
