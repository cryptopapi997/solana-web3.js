import type { Decoder } from '@solana/codecs-core';

import type { Account, EncodedAccount } from './account';
import type { MaybeAccount, MaybeEncodedAccount } from './maybe-account';

/** Decodes the data of a given account using the provided decoder. */
export function decodeAccount<TData extends object, TAddress extends string = string>(
    encodedAccount: EncodedAccount<TAddress>,
    decoder: Decoder<TData>,
): Account<TData, TAddress>;
export function decodeAccount<TData extends object, TAddress extends string = string>(
    encodedAccount: MaybeEncodedAccount<TAddress>,
    decoder: Decoder<TData>,
): MaybeAccount<TData, TAddress>;
export function decodeAccount<TData extends object, TAddress extends string = string>(
    encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>,
    decoder: Decoder<TData>,
): Account<TData, TAddress> | MaybeAccount<TData, TAddress> {
    try {
        if ('exists' in encodedAccount && !encodedAccount.exists) {
            return encodedAccount;
        }
        return Object.freeze({ ...encodedAccount, data: decoder.decode(encodedAccount.data) });
    } catch (error) {
        // TODO: Coded error.
        const newError = new Error(`Failed to decode account [${encodedAccount.address}].`);
        newError.cause = error;
        throw newError;
    }
}

function accountExists<TData extends object>(account: Account<TData> | MaybeAccount<TData>): account is Account<TData> {
    return !('exists' in account) || ('exists' in account && account.exists);
}

/** Asserts that an account has been decoded. */
export function assertAccountDecoded<TData extends object, TAddress extends string = string>(
    account: Account<TData | Uint8Array, TAddress>,
): asserts account is Account<TData, TAddress>;
export function assertAccountDecoded<TData extends object, TAddress extends string = string>(
    account: MaybeAccount<TData | Uint8Array, TAddress>,
): asserts account is MaybeAccount<TData, TAddress>;
export function assertAccountDecoded<TData extends object, TAddress extends string = string>(
    account: Account<TData | Uint8Array, TAddress> | MaybeAccount<TData | Uint8Array, TAddress>,
): asserts account is Account<TData, TAddress> | MaybeAccount<TData, TAddress> {
    if (accountExists(account) && account.data instanceof Uint8Array) {
        // TODO: coded error.
        throw new Error(`Expected account [${account.address}] to be decoded.`);
    }
}

/** Asserts that all accounts have been decoded. */
export function assertAccountsDecoded<TData extends object, TAddress extends string = string>(
    accounts: Account<TData | Uint8Array, TAddress>[],
): asserts accounts is Account<TData, TAddress>[];
export function assertAccountsDecoded<TData extends object, TAddress extends string = string>(
    accounts: MaybeAccount<TData | Uint8Array, TAddress>[],
): asserts accounts is MaybeAccount<TData, TAddress>[];
export function assertAccountsDecoded<TData extends object, TAddress extends string = string>(
    accounts: (Account<TData | Uint8Array, TAddress> | MaybeAccount<TData | Uint8Array, TAddress>)[],
): asserts accounts is (Account<TData, TAddress> | MaybeAccount<TData, TAddress>)[] {
    const encoded = accounts.filter(a => accountExists(a) && a.data instanceof Uint8Array);
    if (encoded.length > 0) {
        const encodedAddresses = encoded.map(a => a.address).join(', ');
        // TODO: Coded error.
        throw new Error(`Expected accounts [${encodedAddresses}] to be decoded.`);
    }
}
