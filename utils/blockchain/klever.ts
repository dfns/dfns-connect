import { Transaction, Contracts, TXContract_ContractType } from "@klever/sdk-node";
import { bech32 } from "bech32";
import useSWR from "swr";

// node docs https://klever.gitbook.io/kleverchain-sdk/
// API & SDK https://docs.klever.finance/api-and-sdk
// Swagger Proxy https://api.testnet.klever.finance/swagger/index.html
// Swagger Node https://node.testnet.klever.finance/swagger/index.html
// Busy address to test klv144cajz4u5hw56aau7ljzxwfsj06dqltc8et3qtejady2th33akksfhmlsu


export interface KleverAsset {
    address: string;
    assetId: string;
    collection: string;
    assetName: string;
    assetType: number;
    balance: number;
    precision: number;
    frozenBalance: number;
    unfrozenBalance: number;
    lastClaim: {
        timestamp: number;
        epoch: number;
    };
    buckets: [];
    stakingType: number;
}

export interface KleverAccountResponse {
    data: {
        account?: {
            address: string;
            nonce: number;
            rootHash: string;
            balance: number;
            frozenBalance: number;
            allowance: number;
            permissions: string[];
            timestamp: number;
            assets: Record<string, KleverAsset>;
        };
    };
    error: string;
    code: string;
}


export interface KleverTransactionsResponse {
    data: {
        transactions: [{
            hash: string;
            blockNum: number;
            sender: string;
            nonce: number;
            data: string[];
            timestamp: number;
            kAppFee: number;
            kdaFee: {
                kda: string;
                amount: number;
            };
            bandwidthFee: number;
            status: string;
            resultCode: string;
            version: number;
            chainID: string;
            signature: string[];
            searchOrder: number;
            receipts: [{
                cID: number;
                signer: string;
                type: number;
                typeString: string;
                weight: string;
                poolId: string;
                assetId: string;
                from: string;
                to: string;
                value: number;
            }];
            contract: [{
                type: number;
                typeString: string;
                parameter: {
                    amount: number;
                    assetId: string;
                    toAddress: string;
                };
            }];
        }];
    };
    pagination: {
        self: number;
        next: number;
        previous: number;
        perPage: number;
        totalPages: number;
        totalRecords: number;
    };
    error: string;
    code: string;
}

const mainnetProviders = {
    node: "https://node.mainnet.klever.finance",
    api: "https://api.mainnet.klever.finance",
}

const testnetProviders = {
    node: "https://node.testnet.klever.finance",
    api: "https://api.testnet.klever.finance",
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const hexToBytes = (hex: string): Uint8Array => {
    if (hex.length % 2 !== 0) {
        throw new Error('Invalid hex string');
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

export const getKLVAddressFromPublicKey = (publicKey: string) => {
    // Our pub key is hex encoded and we need to get a klv address
    // first convert to bytes a824baef8cad745bb58148551728d245d6fc21679d1b8f3bbf6abed957f61471
    // then convert to words
    // finall kvl encode klv14qjt4muv4469hdvpfp23w2xjght0cgt8n5dc7wald2ldj4lkz3cs02lqna 
    const address = bech32.encode("klv", bech32.toWords(hexToBytes(publicKey)))
    return address
}

export const getKleverAccount = (address: string, useTestnet: boolean) => {
    const providers = useTestnet ? testnetProviders : mainnetProviders
    const results = useSWR<KleverAccountResponse>(
        `${providers.api}/v1.0/address/${address}`,
        fetcher
    )

    return {
        ...results,
        isLoading: !results.data && !results.error,
    }
}


export const getKleverAccountTransactions = (address: string, useTestnet: boolean) => {
    const providers = useTestnet ? testnetProviders : mainnetProviders
    const results = useSWR<KleverTransactionsResponse>(
        `${providers.api}/v1.0/transaction/list?address=${address}`,
        fetcher
    )

    return {
        ...results,
        isLoading: !results.data && !results.error,
    }
}

export const getTransactionToSign = (
    senderAddress: string,
    receiverAddress: string,
    senderNonce: number,
    asset: string,
    amount: number,
    useTestnet: boolean) => {

    const enc = new TextEncoder();

    const senderDecoded = Uint8Array.from(bech32.fromWords(bech32.decode(senderAddress).words))
    const receiverDecoded = Uint8Array.from(bech32.fromWords(bech32.decode(receiverAddress).words))

    // create transfer contract
    const transfer = Contracts.TransferContract.fromPartial({
        ToAddress: receiverDecoded,
        AssetID: enc.encode(asset),
        Amount: amount, // Must be in units (check asset precision) -> 100 KLV = 100 * 10^6 
    });

    // create base transaction
    // testnet chainid 100420
    // mainnet chainid 108
    const chainID = useTestnet ? "100420" : "108"
    const tx = new Transaction({
        Sender: senderDecoded,
        Nonce: senderNonce,
        BandwidthFee: 2000000, // Required transfer fees
        KAppFee: 1000000,  // Required transfer fees
        Version: 1,
        ChainID: enc.encode(chainID)
    });

    // add contract to transaction
    tx.addContract(TXContract_ContractType.TransferContractType, transfer);

    return tx
}

export const broadcastTransactions = async (txs: string[], useTestnet: boolean) => {
    const providers = useTestnet ? testnetProviders : mainnetProviders
    console.log("broadcasting txs", JSON.stringify(txs[0]))
    const res = await fetch(`${providers.node}/transaction/broadcast`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ txs }),
    });
    return res.json();
}