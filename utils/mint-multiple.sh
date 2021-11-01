#!/bin/sh
max=34
for (( i=0; i < $max; ++i ))
do
    ts-node ~/code/metaplex/js/packages/cli/src/candy-machine-cli.ts mint_one_token -k ~/.config/solana/devnet.json
done