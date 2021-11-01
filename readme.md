# Resources
These are resources I've found in the discord that provide extra functionality beyond what the Metaplex repo offers

## Full Metaplex FAQ
check this [resource](https://hackmd.io/@archaeopteryx/By4bpbA4F#CM-Upload-Costs) out before anything. Odds are, the answers you seek are there.

## Exiled Apes
This [repo](https://github.com/exiled-apes/candy-machine-mint) should be used after candy machine creation as this does not work without several environment variables set.

## Airdrop Tool
This [repo](https://github.com/h4rkl/Ghetto-SolAir) is useful for airdropping presale NFT's.

## Metaplex Fee Calculator
This [site](https://feecalc.live/) Calculates the arweave upload (only arweave?) and candymachine config cost.

## ~~Arweave direct uploads~~ This should no longer be necessary as of Oct 31st 2021. 
this [repo](https://github.com/0xEnrico/arweave-nft-uploader) is a python utility that helps lower the cost of uploads.

## Arweave direct upload fee calculator
[link](https://jcx2olqdzwgm.arweave.net/71giX-OY-3LwXtfr44B2dDyzW8mPHEAKA-q0wGT0aRM)

## General things to consider before your mint
Great general [resource](https://medium.com/@elysianft/lets-put-an-end-to-bad-drops-on-solana-c8cfd6d33e69)

## Devnet Run Step-by-Step
In this section I am documenting my process (Oct 31st, 2021) on a full devnet run from asset uploads to minting on a website. Updates will be added when I go to use tools to lower costs, move to mainnet, etc.

Note that this assumes you already have the Solana CLI Tools installed, have set your config to devnet and have a keypair already generated at ``~/.config/solana/devnet.json``

Note that this assumes your assets are already organized in numerical pairs as described [here](https://hackmd.io/@levicook/HJcDneEWF).

1. Clone [metaplex](https://github.com/metaplex-foundation/metaplex) and run the following commands:
```
cd metaplex/js
yarn install && yarn bootstrap && yarn build
```

2. Make sure that the CLI tool works
```
# from the js directory
cd packages/cli/src
ts-node candy-machine-cli.ts -h
# output
Usage: candy-machine-cli [options] [command]

Options:
  -V, --version                                      output the version number
  -h, --help                                         display help for command

Commands:
  upload [options] <directory>
  verify_token_metadata [options] <directory>
  verify [options]
  verify_price [options]
  show [options]
  create_candy_machine [options]
  update_candy_machine [options]
  mint_one_token [options]
  sign [options]
  sign_all [options]
  generate_art_configurations [options] <directory>
  create_generative_art [options]
  help [command]
```

3. Check your assets for inconsistencies. I've developed a utility that combines all of the checks found [here](https://hackmd.io/@levicook/HJcDneEWF) for ease of use. You can find it in the ``utils`` folder.

Add your assets to the utils directory in a folder named ``assets`` and run the shell script.
``./asset-checks.sh``
The output should look something like this
```
Counting all assets...
     954
Counting all metadata files...
     477
Counting all image files...
     477
Name check sends all of the names to out.txt file...
./asset-checks.sh:9: permission denied: out.txt
Checking Symbol values...
 477 $SOUL
this command flattens, then counts the unique properties.creators values in your metadata.
for most projects, you should see a consistent count across all parties (address-[1..3])
 477 [<"wallet">,34]
 477 [<"wallet">,33]
 477 [<"wallet">,33]
this command extends the prior command by extracting the shares & summing them up.
you should expect this to output 100...
100
this command extracts unique seller_fee_basis_points, then sorts and counts them.
for most projects you should see a consistent count across all metadata...
 477 750
```

Also check the ``out.txt`` in the utils folder file to verify that the names of your NFT's look correct.

4. Upload
The cli arguments as of Oct 31st 2021 look like this
```
Usage: candy-machine-cli upload [options] <directory>

Arguments:
  directory                          Directory containing images named from 0-n

Options:
  -e, --env <string>                 Solana cluster env name (default:
                                     "devnet")
  -k, --keypair <path>               Solana wallet location (default:
                                     "--keypair not provided")
  -l, --log-level <string>           log level
  -c, --cache-name <string>          Cache file name (default: "temp")
  -n, --number <number>              Number of images to upload
  -s, --storage <string>             Database to use for storage (arweave,
                                     ipfs, aws) (default: "arweave")
  --ipfs-infura-project-id <string>  Infura IPFS project id (required if using
                                     IPFS)
  --ipfs-infura-secret <string>      Infura IPFS scret key (required if using
                                     IPFS)
  --aws-s3-bucket <string>           (existing) AWS S3 Bucket name (required if
                                     using aws)
  --no-retain-authority              Do not retain authority to update metadata
  --no-mutable                       Metadata will not be editable
  -r, --rpc-url <string>             custom rpc url since this is a heavy
                                     command
  -h, --help                         display help for command
```

Run the following command assuming your assets are in the cli ``src`` folder and all default settings.

``ts-node candy-machine-cli.ts upload assets -k ~/.config/solana/devnet.json -n <# of assets>``

Verify that the upload was successful

``ts-node candy-machine-cli.ts verify -k ~/.config/solana/devnet.json``

5. Create your candy machine

``ts-node candy-machine-cli create_candy_machine -k ~/.config/solana/devnet.json -p 0.1 -s <treasury public key>``

```
# reference
Usage: candy-machine-cli create_candy_machine [options]

Options:
  -e, --env <string>                   Solana cluster env name (default:
                                       "devnet")
  -k, --keypair <path>                 Solana wallet location (default:
                                       "--keypair not provided")
  -l, --log-level <string>             log level
  -c, --cache-name <string>            Cache file name (default: "temp")
  -p, --price <string>                 Price denominated in SOL or spl-token
                                       override (default: "1")
  -t, --spl-token <string>             SPL token used to price NFT mint. To use
                                       SOL leave this empty.
  -a, --spl-token-account <string>     SPL token account that receives mint
                                       payments. Only required if spl-token is
                                       specified.
  -s, --sol-treasury-account <string>  SOL account that receives mint payments.
  -r, --rpc-url <string>               custom rpc url since this is a heavy
                                       command
  -h, --help                           display help for command
```

6. Set a start and price for your candy machine.

``ts-node candy-machine-cli.ts update_candy_machine -k ~/.config/solana/devnet.json -d "31 Oct 2021 00:16:30 CDT" -p 0.1``

```
# reference
ts-node candy-machine-cli.ts update_candy_machine -h
Usage: candy-machine-cli update_candy_machine [options]

Options:
  -e, --env <string>         Solana cluster env name (default: "devnet")
  -k, --keypair <path>       Solana wallet location (default: "--keypair not
                             provided")
  -l, --log-level <string>   log level
  -c, --cache-name <string>  Cache file name (default: "temp")
  -d, --date <string>        timestamp - eg "04 Dec 1995 00:12:00 GMT" or "now"
  -p, --price <string>       SOL price
  -r, --rpc-url <string>     custom rpc url since this is a heavy command
  -h, --help                 display help for command
```

At this point you have all you need to add your candy machine config to your frontend.


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

### There is any command in update candy machine to pause the mint?
You can set the date 100 years in the future and forget about it

### Whats a good hosting plan?
Netlify, Vercel, or CloudFlare Pages prop plan are recommended.

### If I don't run update_candy_machine with a specific time, is it possible to mint at all?
If there is no set start date, only the owner will be able to operate the candy machine.

### Does file size matter as far as upload costs?
No. The minimum file size is 25KB and the max is 10MB.

### can you close the config account once the launch is over and redeem the leftover rent?
No, you can only tweak the rent beforehand.
