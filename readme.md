# Resources
These are resources I've found in the discord that provide extra functionality beyond what the Metaplex repo offers

## Exiled Apes
This [repo](https://github.com/exiled-apes/candy-machine-mint) should be used after candy machine creation as this does not work without several environment variables set.

## Airdrop TOol
This [repo](https://github.com/h4rkl/Ghetto-SolAir) is useful for airdropping presale NFT's.

## Metaplex Fee Calculator
This [site](https://feecalc.live/) Calculates the arweave upload (only arweave?) and candymachine config cost.

## Arweave direct uploads
this [repo](https://github.com/0xEnrico/arweave-nft-uploader) is a python utility that helps lower the cost of uploads.

# FAQ

### If I only have one creator address do I need to include shares?
Yes, set the shares of your single creator address to 100.

### If I do 2 candy machines, will they be signed as 1 collection tho?
They will have to be signed separately, but will be under the same collection if you put the same collection in the metadata. 

### Which QuickNode Plan is robust for 10K Launch (with traffic around 10-15K users online during launch) ?
(Quicknode Pro Plan)[https://www.quicknode.com/pricing] if you expect to sell out.

### How do you set up a custom Quicknode RPC for the CLI program?
locate the ``accounts.ts`` file here:

``metaplex-foundation/metaplex/js/packages/cli/src/helpers/accounts.ts``

Go to line 283 and change the following:

```
const solConnection = new web3.Connection(web3.clusterApiUrl(env));
---------------------------- CHANGE TO ----------------------------
const solConnection = new web3.Connection(<your quicknode url here>);
```

### How do you set up a custom Quicknode RPC for the exiled Apes repository?
Set the ``REACT_APP_SOLANA_RPC_HOST`` environment variable to your Quicknode URL

### How do mint free NFT's (for giveaways, team members, etc)?
-   Set the start date for your mint to some time in the distant future (ie Year 3000)
-   Set the mint price to 0
-   Use the mint_one_token command to mint nft to yourself.

### How can I use Arweave directly to cut costs of upload?
this [repo](https://github.com/0xEnrico/arweave-nft-uploader) is a python utility that helps lower the cost of uploads.