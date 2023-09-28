# Harnessing the Power of Phat Contract Starter Kit
> <u>*Note on Terminology*</u>
> 
> **Phat Contract** will be referred to as the **Phala Oracle** in this `README`. 
## Overview
The Phat Contract Starter Kit is your one-stop solution to connect any API to your smart contract. It offers wide-ranging support for all EVM-compatible blockchains, including but not limited to Ethereum, Polygon, Arbitrum, Avalanche, Binance Smart Chain, Optimism, and zkSync.

![](./assets/case-self-owned-oracles.jpg)

This starter kit empowers you to initiate the data request from the smart contract side. The request is then seamlessly sent to your script for processing. You have the liberty to call any APIs to fulfill the request and define the response data structure that will be replied to your smart contract.
## Quick Start
To kickstart your journey with the Phat Contract Starter Kit, you will first need to install the [@phala/fn](https://www.npmjs.com/package/@phala/fn) CLI tool. You can do this using your node package manager (`npm`) or use node package execute (`npx`). For the purpose of this tutorial, we will be using `npx`.

Once you have the CLI tool installed, you can create your first Phala Oracle template with the following command:
```bash
npx @phala/fn init example
```
After creating a Phala Oracle template, it's time to install the package dependencies. You can do this with the following command:
```bash
yarn install
```
Now, build the default Phala Oracle function with this command:
```bash
yarn build-function
```
To simulate the expected result locally, run the Phala Oracle function now with this command:
```bash
yarn run-function -a 0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000043078303100000000000000000000000000000000000000000000000000000000 https://api-mumbai.lens.dev
```
Finally, run the local end-to-end tests with this command:
```bash
yarn hardhat test
```
Congratulations! You have successfully completed the quick start. For the next steps, you will learn how to deploy your Phala Oracle and connect to the consumer contract for the EVM testnet chain to start testing the request-response model live.

For a deeper dive into the details, click [here](./GETTING_STARTED.md),  or continue reading to learn about the valuable features the Phala Oracle can offer to your on-chain consumer contract.

## Features and Benefits

- Wide support for all mainstream blockchains
- **Verifiable and decentralized**: every Oracle is running on decentralized infrastructure that require no operations and can be easily verified
![](./assets/RA-Attested-Verifiable.png)
- **Support private data**: your Oracle state is protected by cryptography and hardware
![](./assets/Cross-chain-e2ee.png)
- **No extra cost**: the only cost is the gas fee of response data which is sent as a transaction
- **High frequency**: the request is synced to Oracle within one minute, and the latency of response is only limited by blockchain’s block interval

## Use cases & Examples

You could use the Oracle to:
- **[Create a Telegram / Discord trading bot with Phat Contract](https://github.com/pacoyang/phatbot)**
- **[Cross-chain DEX Aggregator](./assets/case-cross-chain-dex-aggregator.jpg)**
- **[Bring Web2 services & data on-chain](./assets/case-contract-controlled-web2-service.jpg)**
- **Web3 Social Integrations**
  - **[LensAPI Oracle](https://github.com/Phala-Network/lensapi-oracle-consumer-contract)**
  - **[Lens Phite](https://github.com/aeyshubh/lens-Phite2)**
  - **[Mint NFT based on LensAPI Oracle data](./assets/LensAPI-Oracle.png)**
  - **[Lens Treasure Hunt](https://github.com/HashWarlock/lensapi-oracle-devdao-workshop)**
- **[Get Randomness on-chain from drand.love and post with Telegram bot](https://github.com/HashWarlock/phat-drand-tg-bot)**
- **Trustless HTTPS requests w/ [TLSNotary](https://tlsnotary.org/) integration**
- **[Connect to Phat Contract Rust SDK](./assets/Oracle-Rust-SDK.png)** to access all features
- **[Dynamic NFTs](https://github.com/keshavsharma25/PokeLens-Contract)**

## Resources
- **[What’s Oracle](https://ethereum.org/en/developers/docs/oracles/)**
- **Frontend Templates**
  - **[Scaffold ETH2](https://github.com/scaffold-eth/scaffold-eth-2)**
    - **[Phat Scaffold ETH2](https://github.com/HashWarlock/phat-scaffold-eth)**
  - **[Create ETH App](https://github.com/paulrberg/create-eth-app)**
  - **[Nexth Starter Kit](https://nexth.vercel.app/)**
- **[Technical design doc](https://github.com/Phala-Network/phat-offchain-rollup)**
