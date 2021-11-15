#!/bin/sh
max=1
for (( i=0; i < $max; ++i ))
do
    ts-node ~/code/metaplex/js/packages/cli/src/candy-machine-cli.ts mint_one_token -e mainnet -k ~/.config/solana/mainnet.json -c presale_1 -r https://icy-snowy-field.solana-mainnet.quiknode.pro/2b6ac6a3f8926dac99cebce3a42afdc65e60f6dc/
done