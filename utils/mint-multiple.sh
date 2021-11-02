#!/bin/sh
max=300
for (( i=0; i < $max; ++i ))
do
    ts-node ~/code/metaplex/js/packages/cli/src/candy-machine-cli.ts mint_one_token -k ~/.config/solana/devnet.json -c presale -r https://wandering-frosty-bird.solana-devnet.quiknode.pro/d6bda74cef4e53df4895f53632df1b7a008854ae/
done