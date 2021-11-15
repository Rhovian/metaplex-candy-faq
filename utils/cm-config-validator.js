const fs = require("fs");
const https = require("https");

async function fetch(url, options = {}){
	return new Promise((resolve, reject) => {
		let req = https.request(url, options, res => {
			let data = "";
			res.on("data", d => data += d);
			res.on("end", e =>
				resolve({
					headers: res.headers,
					status: res.statusCode,
					url,
					text: async () => data,
					json: async () => JSON.parse(data)
				})
			);
		});

		req.on("error", reject);

		let body = options.body;
		if(typeof body != "string")
			body = JSON.stringify(body);
		if(body && options.method != "GET" && options.method != "HEAD")
			req.write(body);
		
		req.end();
	});
}

async function getAccountInfo(address){
	return fetch("https://api.metaplex.solana.com/", {
		headers: {
			"content-type": "application/json",
		},
		method: "POST",
		body: {
			id: "0",
			jsonrpc: "2.0",
			method: "getAccountInfo",
			params: [
				address,
				{
					encoding: "jsonParsed",
					commitment: "confirmed"
				}
			]
		}
	}).then(e => e.json()).then(e => e.result);
}

function parseConfigData(dataRaw, offset){
	const ARRAY_START = 251;
	
	const LINE_SIZE =
		4 + 32 + // max name length
		4 + 200; // max uri length
	
	offset = Buffer.from(dataRaw, "base64");
	
	let arrayLength = offset.readInt32LE(ARRAY_START - 4);
	console.log(arrayLength);
	let items = new Array(arrayLength);
	for(let i = 0; i < arrayLength; i++)
		items[i] = parseConfigLine(offset, ARRAY_START + i * LINE_SIZE);
	
	return items;
}

async function downloadMetadata(item){
	if(!item.name || !item.link)
		return;
	
	let number = item.name.match(/\d+/)[0];
	let filepath = `assets/${number}.json`;
	if(fs.existsSync(filepath))
		return;
	
	console.log(`Downloading JSON ${filepath.padStart(9)}`);
	
	let redirect = await fetch(item.link);
	let metadata = await fetch(redirect.headers.location + "/").then(e => e.json());
	
	metadata.seller_fee_basis_points = 400;
	metadata.symbol = "SOLBUSTERS";
	metadata.name = metadata.name.toUpperCase();
	
	metadata.properties.creators = [
		{
			address: "DX4QMgPSDf6vomW4sbBZ1tmHd8Vb8ChLDyGrS3sMcbD4",
			share: 46
		},
		{
			address: "FvAWuZrZip95xVNzr4gjbQ6Ws8dwxo22XYHcH8Fy3y9A",
			share: 46
		},
		{
			address: "DeBtJy88jrnheD8F3HEAqiQztykXksgMyvmcByHC5RGv",
			share: 8
		}
    ];
	
	await fs.promises.writeFile(
		filepath,
		JSON.stringify(metadata, null, 4)
	);
}

function parseConfigLine(data, offset){
	offset += 4;
	let name = data
		.toString("utf8", offset, offset + 32)
		.replace(/\0/g, "");
	offset += 32;
	
	offset += 4;
	let link = data
		.toString("utf8", offset, offset + 200)
		.replace(/\0/g, "");
	offset += 200;
	
	return {name, link};
}

async function main(args){
	let candyMachineConfigId = "";
	let numberOfEntries = -1;
	let outputPath = "cache.json";
	for(let i = 0; i < args.length; i++)
		if(args[i] == "-n")
			numberOfEntries = parseInt(args[++i]);
		else if(args[i] == "-o")
			outputPath = args[++i];
		else
			candyMachineConfigId = args[i];
	
	let candyMachineConfig = await getAccountInfo(candyMachineConfigId);
	let candyMachineConfigData = candyMachineConfig.value.data[0];
	let items = parseConfigData(candyMachineConfigData);
	
	console.log(`Found ${items.length} NFTs`);
	let config = { items };
	// await fs.promises.writeFile(
		// outputPath,
		// JSON.stringify(config)
	// );
	
	console.log(items.filter(e => e.name != "").length);
	
	/*
	for(let item of items)
		console.log(item);
	*/
	console.log(items.length)
	
	// if(!fs.existsSync("assets"))
		// await fs.promises.mkdir("assets");
	
	// for(let i = 0; i < items.length; i++){
		// let wait = [];
		// for(let j = 0; j < 20 && i < items.length; i++, j++)
			// wait.push(downloadMetadata(items[i]))
		
		// await Promise.all(wait);
	// }
}

if(require.main)
	main(process.argv.slice(2)).catch(console.error);