# Phat Contract Details

## Overview
This file will describe the contents of [`./index.ts`](./index.ts) and describe the entry point at which the TypeScript file will execute the requested off-chain compute from the `OracleConsumerContract.sol` smart contract. The entry beings at the function `main(request: HexString, settings:string)`.

Here is what you need to implemented for Phat Contract, you can customize your logic with
TypeScript here.

## Request, Secrets & HTTP Request Syntax
The Phat Contract will be called with two parameters:
- `request`: The raw payload from the contract call `request` (check the `request` function in OracleConsumerContract.sol). 
  - Default function will be `string memory reqStr`.
    ```typescript
    function request(string memory reqStr) public {
        // assemble the request
        uint id = nextRequest;
        // requests[id] = reqStr is a mapping of the requestId to the reqStr sent by the client (id => reqStr).
        requests[id] = reqStr;
        // We can see here that we call abi.encode(id, reqStr) which is encoding the tuple of (requesstId, requestId).
        // Next, _pushMessage() pushed the encoded tuple is pushed onto the Action queue in the Phat Anchor Rollup Contract.
        _pushMessage(abi.encode(id, reqStr));
        // Lastly, the uint nextRequest is incremented by 1. This  ensures the actions are atomic and will be only executed once.
        nextRequest += 1;
    }
    ```
    - This is a fairly simple example, but now the action is queued and the consumer contract will wait for the response from the Phat Contract.
- `settings`: The custom settings you set with the `config_core` function of the Action Offchain Rollup Phat Contract. 
    - In this example, it just a simple text and can be used to store secrets if the string is formatted in a `JSON` string to hold multiple secrets. Let's check the example below.
    ```typescript
    // Example one is a URL to an HTTP endpoint. We will target the endpoint `https://api.hashwarlock.dev` which returns a number 2,813,308,004 when HTTP GET is called with the `reqStr`. Let's look at different ways to format the HTTP request in the file.
     
    ```


Your returns value MUST be a hex string, and it will send to your contract directly. Check the `_onMessageReceived` function in
OracleConsumerContract.sol for more details. We suggest a tuple of three elements: [successOrNotFlag, requestId, data] as
the return value.
