import type { IRpcApiMethods } from '@solana/rpc-transport';
import { Commitment, LamportsUnsafeBeyond2Pow53Minus1 } from '@solana/rpc-types';

import { U64UnsafeBeyond2Pow53Minus1 } from './common';

type GetMinimumBalanceForRentExemptionApiResponse = LamportsUnsafeBeyond2Pow53Minus1;

export interface GetMinimumBalanceForRentExemptionApi extends IRpcApiMethods {
    /**
     * Returns the minimum balance to exempt an account of a certain size from rent
     */
    getMinimumBalanceForRentExemption(
        size: U64UnsafeBeyond2Pow53Minus1,
        config?: Readonly<{
            commitment?: Commitment;
        }>,
    ): GetMinimumBalanceForRentExemptionApiResponse;
}
