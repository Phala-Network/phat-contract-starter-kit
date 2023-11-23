import {decodeAbiParameters, encodeAbiParameters, parseAbiParameters} from "viem";

export type HexString = `0x${string}`;
export const encodeReplyAbiParams = 'uint respType, uint id, uint256 data';
export const decodeRequestAbiParams = 'uint id, string reqData';

export function encodeReply(abiParams: string, reply: [bigint, bigint, bigint]): HexString {
  return encodeAbiParameters(parseAbiParameters(abiParams),
    reply
  );
}

export function decodeRequest(abiParams: string, request: HexString): any {
  return decodeAbiParameters(parseAbiParameters(abiParams),
    request
  );
}
