# Phala's Oracle Starter Kit
## Overview
The Oracle Starter Kit is suitable to connect any API to your smart contract. It supports all EVM-compatible blockchains including Ethereum, Polygon, Arbitrum, Avalanche, Binance Smart Chain, Optimism and zkSync.
![](./assets/case-self-owned-oracles.jpg)
Using this starter kit allows you to initiate the data request from smart contract side. The request is transparently sent to your script for processing. You are free to call any APIs to fulfill the request. Finally, you can freely define the response data structure that will be replied to your smart contract.

## Quick Start
First you will need to install the [@phala/fn](https://www.npmjs.com/package/@phala/fn) CLI tool using your node package manager (`npm`) or use node package execute (`npx`). In this tutorial we use `npx`.

Now create your first template with the CLI tool command:
```bash
npx @phala/fn init example
```
With a template created, install the package dependencies with the following command:
```bash
yarn install
```
Build the default function with this command:
```bash
yarn build-function
```
Run the function now to simulate the expected result locally.
```bash
yarn run-function -a 0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000043078303100000000000000000000000000000000000000000000000000000000 https://api-mumbai.lens.dev
```
Now run the local end-to-end tests.
```bash
yarn hardhat test
```
Now you have successfully completed the quick start. For the next steps, you will learn how to deploy your Oracle and connect to the consumer contract for the EVM testnet chain to start testing the request-response model live.

Feel free to dive into the details [here](./GETTING_STARTED.md), or continue learning about the valuable features Phat Contract can offer to your on-chain consumer contract.

## Features

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
