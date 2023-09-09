import "dotenv/config"
import fs from 'fs'
import type { Result, u16 } from '@polkadot/types'
import { type AccountId } from '@polkadot/types/interfaces'
import { Abi } from '@polkadot/api-contract'
import { OnChainRegistry, options, PinkContractPromise, PinkBlueprintPromise, signCertificate, PinkBlueprintSubmittableResult, signAndSend } from "@phala/sdk"
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Keyring } from '@polkadot/keyring'
import dedent from "dedent"

async function main() {
  const endpoint = process.env.PHALA_TESTNET_ENDPOINT || 'wss://poc5.phala.network/ws'
  if (!endpoint) {
    throw new Error('Please set PHALA_TESTNET_ENDPOINT via .env file first.')
  }
  const mumbaiRpcUrl = process.env.MUMBAI_RPC_URL
  if (!mumbaiRpcUrl) {
    throw new Error('Please set MUMBAI_RPC_URL via .env file first.')
  }
  const mumbaiConsumerContractAddress = process.env.MUMBAI_CONSUMER_CONTRACT_ADDRESS
  if (!mumbaiConsumerContractAddress) {
    throw new Error('Please set MUMBAI_CONSUMER_CONTRACT_ADDRESS via .env file first.')
  }

  console.log(dedent`
    We going to deploy your Phat Function to Phala Network Testnet: ${endpoint}
  `)

  const apiPromise = await ApiPromise.create(options({ provider: new WsProvider(endpoint), noInitWarn: true }))
  const registry = await OnChainRegistry.create(apiPromise)

  const keyring = new Keyring({ type: 'sr25519' })
  let pair
  if (process.env.POLKADOT_WALLET_SURI) {
    pair = keyring.addFromUri(process.env.POLKADOT_WALLET_SURI)
  } else if (process.env.POLKADOT_WALLET_PASSPHRASE && fs.existsSync('./polkadot-account.json')) {
    const exported = fs.readFileSync('./polkadot-account.json', 'utf8')
    pair = keyring.createFromJson(JSON.parse(exported))
    pair.decodePkcs8(process.env.POLKADOT_WALLET_PASSPHRASE)
  } else {
    throw new Error('You need set a polkadot account to continue, please check README.md for details.')
  }
  const cert = await signCertificate({ pair })

  const brickProfileFactoryAbi = fs.readFileSync('./abis/brick_profile_factory.json', 'utf8')
  const brickProfileFactoryContractId = process.env.PHAT_BRICKS_TESTNET_FACTORY_CONTRACT_ID || '0x489bb4fa807bbe0f877ed46be8646867a8d16ec58add141977c4bd19b0237091'
  if (!brickProfileFactoryContractId) {
    throw new Error('Please set PHAT_BRICKS_TESTNET_FACTORY_CONTRACT_ID via .env file first.')
  }
  const brickProfileFactoryContractKey = await registry.getContractKeyOrFail(brickProfileFactoryContractId)
  const brickProfileFactory = new PinkContractPromise(apiPromise, registry, brickProfileFactoryAbi, brickProfileFactoryContractId, brickProfileFactoryContractKey)
  const { output: brickProfileAddressQuery } = await brickProfileFactory.query.getUserProfileAddress<Result<AccountId, any>>(pair.address, { cert })
  if (!brickProfileAddressQuery.isOk || !brickProfileAddressQuery.asOk.isOk) {
    throw new Error('Brick Profile Factory not found.')
  }
  const brickProfileContractId = brickProfileAddressQuery.asOk.asOk.toHex()
  const contractInfo = await registry.phactory.getContractInfo({ contracts: [brickProfileContractId] })
  const brickProfileCodeHash = contractInfo.contracts[0].codeHash

  console.log(`Your Brick Profile contract ID: ${brickProfileContractId}`)

  let brickProfileAbi
  // compatible for previously version.
  if (brickProfileCodeHash === '0x3b3d35f92494fe60d9f9f6139ea83964dc4bca84d7ac66e985024358c9c62969') {
    brickProfileAbi = fs.readFileSync('./abis/brick_profile-0.2.0.json', 'utf8')
  } else {
    brickProfileAbi = fs.readFileSync('./abis/brick_profile-1.0.1.json', 'utf8')
  }

  const brickProfileContractKey = await registry.getContractKeyOrFail(brickProfileContractId)
  const brickProfile = new PinkContractPromise(apiPromise, registry, brickProfileAbi, brickProfileContractId, brickProfileContractKey)

  const rollupAbi = new Abi(fs.readFileSync('./abis/action_offchain_rollup.json', 'utf8'))
  const blueprint = new PinkBlueprintPromise(apiPromise, registry, rollupAbi, rollupAbi.info.source.wasmHash.toHex())
  const result = await signAndSend<PinkBlueprintSubmittableResult>(
    blueprint.tx.withConfiguration(
      { gasLimit: 1000000000000 },
      process.env.MUMBAI_RPC_URL, // client_rpc
      process.env.MUMBAI_CONSUMER_CONTRACT_ADDRESS, // client_addr
      fs.readFileSync('./dist/index.js', 'utf8'), // core_js
      'https://api-mumbai.lens.dev/', // core_settings
      brickProfileContractId, // brick_profile
    ),
    pair
  )
  await result.waitFinalized()
  const contractPromise = result.contract
  console.log('The ActionOffchainRollup contract has been instantiated: ', contractPromise.address.toHex())

  const { output: attestorQuery } = await contractPromise.query.getAttestAddress(cert.address, { cert })
  const attestor = attestorQuery.asOk.toHex()

  const selectorUint8Array = rollupAbi.messages.find(i => i.identifier === 'answer_request')?.selector.toU8a()
  const selector = Buffer.from(selectorUint8Array!).readUIntBE(0, selectorUint8Array!.length)
  const actions = [
    {
      cmd: 'call',
      config: {
        codeHash: rollupAbi.info.source.wasmHash.toHex(),
        callee: contractPromise.address.toHex(),
        selector,
        input: [],
      },
    },
    {
      cmd: "log",
    },
  ]
  const { output: numberQuery } = await brickProfile.query.workflowCount<u16>(pair.address, { cert })
  const num = numberQuery.asOk.toNumber()
  const { blocknum: initBlockNum } = await registry.phactory.getInfo({})

  await signAndSend(
    brickProfile.tx.addWorkflow({ gasLimit: 1000000000000 }, `My Phat Function ${numberQuery.asOk.toNumber()}`, JSON.stringify(actions)),
    pair
  )

  // How many blocks wait for confirmations
  const confirmations = 8
  while (true) {
    const { blocknum } = await registry.phactory.getInfo({})
    if (blocknum > initBlockNum + confirmations) {
      throw new Error(
        `Wait for transaction finalized in PRuntime but timeout after ${confirmations} blocks.`
      )
    }
    const { output: numberQuery } = await brickProfile.query.workflowCount<u16>(pair.address, { cert })
    if (numberQuery.asOk.toNumber() > num) {
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 5_000))
  }
  const externalAccountId = 0
  await signAndSend(
    brickProfile.tx.authorizeWorkflow({ gasLimit: 1000000000000 }, num, externalAccountId),
    pair
  )
  const finalMessage = dedent`
    🎉 Your workflow has been added, you can check it out here: https://bricks-poc5.phala.network/workflows/${brickProfileContractId}/${num}

       You also need to set up the attestor in your .env file:

       MUMBAI_LENSAPI_ORACLE_ENDPOINT=${attestor}

       Then run:

       yarn test-set-attestor

       Then send the test request with follow up command:

       yarn test-push-request

       You can continue update the Phat Function codes and update it with follow up commands:

       yarn build-function
       WORKFLOW_ID=${numberQuery.asOk.toNumber()} yarn test-update-function
  `
  console.log(`\n${finalMessage}\n`)

  process.exit(0)
}

main().then(() => {
  process.exit(0)
}).catch(err => {
  console.error(err)
  process.exit(1)
})
