# Resources
These are resources I've found in the discord that provide extra functionality beyond what the Metaplex repo offers

## Full Metaplex FAQ
check this [resource](https://hackmd.io/@archaeopteryx/By4bpbA4F#CM-Upload-Costs) out before anything. Odds are, the answers you seek are there.

## Exiled Apes
This [repo](https://github.com/exiled-apes/candy-machine-mint) should be used after candy machine creation as this does not work without several environment variables set.

## Vue version of Exiled Apes
This [repo](https://github.com/Mjavala/vue-candymachine-mint) is a vue implementation of the frontend repo above.

## Airdrop Tool
This [repo](https://github.com/h4rkl/Ghetto-SolAir) is useful for airdropping presale NFT's.

## Metaplex Fee Calculator
This [site](https://feecalc.live/) Calculates the arweave upload (only arweave?) and candymachine config cost.

## Arweave direct upload fee calculator
[link](https://jcx2olqdzwgm.arweave.net/71giX-OY-3LwXtfr44B2dDyzW8mPHEAKA-q0wGT0aRM)

**Note: Fees are constantly changing**

## General things to consider before your mint
Great general [resource](https://medium.com/@elysianft/lets-put-an-end-to-bad-drops-on-solana-c8cfd6d33e69)

## CM Run Step-by-Step (mainnet & devnet commands)
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

Note permissions on the outfile

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

**command with non default arguments**

``ts-node candy-machine-cli.ts upload <asset folder> -k ~/.config/solana/devnet.json -c <cache file name> -n <# of assets> -r <custom url>``

**mainnet command**

``ts-node candy-machine-cli.ts upload main -e mainnet -k ~/.config/solana/mainnet.json -c main -n 7000 -r <rpc url>``


Verify that the upload was successful

``ts-node candy-machine-cli.ts verify -k ~/.config/solana/devnet.json``

**command with non default arguments**

``ts-node candy-machine-cli.ts verify -k ~/.config/solana/devnet.json -c presale-1 -r https://wandering-frosty-bird.solana-devnet.quiknode.pro/d6bda74cef4e53df4895f53632df1b7a008854ae/``

**mainnet command**

``ts-node candy-machine-cli.ts verify -e mainnet -k ~/.config/solana/mainnet.json -c main -r <custom rpc>``

```
# reference
Usage: candy-machine-cli verify [options]

Options:
  -e, --env <string>         Solana cluster env name (default: "devnet")
  -k, --keypair <path>       Solana wallet location (default: "--keypair not provided")
  -l, --log-level <string>   log level
  -c, --cache-name <string>  Cache file name (default: "temp")
  -r, --rpc-url <string>     custom rpc url since this is a heavy command
  -h, --help                 display help for command
```

5. Create your candy machine

``ts-node candy-machine-cli.ts create_candy_machine -k ~/.config/solana/devnet.json -p 0.1 -s <treasury public key>``

**command with non default arguments**
``ts-node candy-machine-cli.ts create_candy_machine -k ~/.config/solana/devnet.json -p <price> -s <treasury address> -c <asset dir name> -r <custom rpc>``

**mainnet command**

``ts-node candy-machine-cli.ts create_candy_machine -e mainnet -k ~/.config/solana/mainnet.json -p 2 -s G8Rkqbhdt7p4DxyHfMCAZSEEqJT58vgkAABkesrGA5ki -c main -r <custom rpc>``
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

**command with non default arguments**

``ts-node candy-machine-cli.ts update_candy_machine -k ~/.config/solana/devnet.json -d "01 Nov 2021 00:20:00 CDT" -p 0.1 -c <art dir> -r <custom rpc>``
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

## Minting out a candy machine from the CLI
There is currently no way to do this other than to call the ``mint_one_token`` command from the metaplex cli.

``ts-node candy-machine-cli.ts mint_one_token -k ~/.config/solana/devnet.json``

**mainnet command**

``ts-node candy-machine-cli.ts mint_one_token -e mainnet -k ~/.config/solana/mainnet.json -c main -r <rpc url>``

```
Usage: candy-machine-cli mint_one_token [options]

Options:
  -e, --env <string>         Solana cluster env name (default: "devnet")
  -k, --keypair <path>       Solana wallet location (default: "--keypair not
                             provided")
  -l, --log-level <string>   log level
  -c, --cache-name <string>  Cache file name (default: "temp")
  -r, --rpc-url <string>     custom rpc url since this is a heavy command
  -h, --help                 display help for command
```

## Sign metadata (optional)
A lot of marketplaces required verified (signed) metadata in order to list.

``ts-node candy-machine-cli.ts sign_all -k ~/.config/solana/devnet.json -c <asset dir> -r <custom rpc>``

**mainnet command**

``ts-node candy-machine-cli.ts sign_all -e mainnet -k ~/.config/solana/mainnet.json -c presale_2 -r <custom rpc>``

```
Usage: candy-machine-cli sign_all [options]

Options:
  -e, --env <string>         Solana cluster env name (default: "devnet")
  -k, --keypair <path>       Solana wallet location (default: "--keypair not provided")
  -l, --log-level <string>   log level
  -c, --cache-name <string>  Cache file name (default: "temp")
  -b, --batch-size <string>  Batch size (default: "10")
  -d, --daemon               Run signing continuously (default: false)
  -r, --rpc-url <string>     custom rpc url since this is a heavy command
  -h, --help                 display help for command
```

## Mainnet Issues

When minting a **large** collection on mainnet (in my case, 7000). I had a lot of issues with the verify command. It turns out that the command itself has issues flagging assets that have not been properly stored on arweave.

How do you find out which ones? People are working on it. For now, there is a script (credit: @KartikSoneji) in the utils folder that will show the total number of NFT's and any problematic config lines.

In order to use this, input your candymachine id to line 127.

Also, verify may fail with an error like this:

```
(node:32222) UnhandledPromiseRejectionWarning: FetchError: request to https://a34exdhjbmda2mdm6p5s32j73hllyvspk4iyxpf6gpv5ygxm6stq.arweave.net/BvhLjOkLBg0wbPP7Lek_2da8Vk9XEYu8vjPr3Brs9Kc failed, reason: getaddrinfo ENOTFOUND a34exdhjbmda2mdm6p5s32j73hllyvspk4iyxpf6gpv5ygxm6stq.arweave.net
    at ClientRequest.<anonymous> (/Users/elo/Code/metaplex/js/node_modules/node-fetch/lib/index.js:1461:11)
    at ClientRequest.emit (events.js:400:28)
    at ClientRequest.emit (domain.js:470:12)
    at TLSSocket.socketErrorListener (_http_client.js:475:9)
    at TLSSocket.emit (events.js:400:28)
    at TLSSocket.emit (domain.js:470:12)
    at emitErrorNT (internal/streams/destroy.js:106:8)
    at emitErrorCloseNT (internal/streams/destroy.js:74:3)
    at processTicksAndRejections (internal/process/task_queues.js:82:21)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:32222) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:32222) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

**this is not an issue with your cm**

the best thing do would be to verify the uri yourself and retry. if it happens with various different assets and all of the uri's work when you go to them manually, you should still be good to go live.

# FAQ

### If I only have one creator address do I need to include shares?
Yes, set the shares of your single creator address to 100.

### If I do 2 candy machines, will they be signed as 1 collection tho?
They will have to be signed separately, but will be under the same collection if you put the same collection in the metadata. 

### How do I get a snapshot of all the holders of my NFT collection?

Try these tools:

- https://sol-nft.tools/
- https://tools.abstratica.art/
- https://github.com/halaprix/getHolderSnapshot
- https://github.com/samuelvanderwaal/metaboss

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

### After uploading and running verify, I get this error: not all NFTs checked out. check out logs above for details; How do I fix this?
First look in your cache for any ``"onChain:false"``occurrances. You should have some. If so, re run your upload command (for free). After this, you should have none set to ``false``. Then run verify again.