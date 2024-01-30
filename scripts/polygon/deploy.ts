import { ethers } from "hardhat";
import "dotenv/config";
import dedent from "dedent";

async function main() {
  const OracleConsumerContract = await ethers.getContractFactory("OracleConsumerContract");

  const [deployer] = await ethers.getSigners();

  console.log('Deploying...');
  const attestor = process.env['POLYGON_PHALA_ORACLE_ATTESTOR'] ?? deployer.address;  // When deploy for real e2e test, change it to the real attestor wallet.
  const consumer = await OracleConsumerContract.deploy(attestor);
  await consumer.deployed();
  const finalMessage = dedent`
    🎉 Your Consumer Contract has been deployed successfully 🎉

    address ${consumer.address}

    Check it out here: https://polygonscan.com/address/${consumer.address}

    You can continue deploying the default Phat Contract with the following command:

    npx @phala/fn upload -b --mode=production --consumerAddress=${consumer.address} --coreSettings=https://api-v2.lens.dev/
  `
  console.log(`\n${finalMessage}\n`);

  console.log('Sending a request...');
  await consumer.connect(deployer).request("0x01c567");
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
