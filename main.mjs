import TracManager from "./TracManager.mjs";
import fs from 'graceful-fs';

let tracCore = new TracManager();
await tracCore.initReader();

/**
 * TOKEN SNAPSHOT SCRIPT for TAP Reader
 *
 * This file is not supposed to run outside of the TAP Reader context.
 * Please make sure to consult the README.md on how to use it.
 *
 * ALSO IMPORTANT: Please read this prior executing:
 * https://twitter.com/trac_btc/status/1765106157520105710
 */

// edit for your snapshot
let token = 'karma'
let decimals = 18
// edit end

let instances = 0;
let holders_length = await tracCore.tapProtocol.getHoldersLength('karma')

console.log('Historic Holders length', holders_length);

for(let i = 0; i * 100 < holders_length; i++) {

    async function load() {
        instances++
        // getting 100-sized chunks
        let result = await getHoldersLite(token, i * 100, 100)
        // can be piped into a txt file on terminal
        // assuming zero and null values not counting
        // this way we skip historic holders
        for(let j = 0; j < result.length; j++)
        {
            if(result[j].balance !== "0" && result[j].balance !== null) {
                await appendFile('./out.csv', result[j].address + ',' + formatNumberString(result[j].balance, decimals) + "\n")
            }
        }
        instances--
    }

    // up to 3 parallel usually ok at 100 chunks to not run into spamming/disconnection problems
    while(instances >= 3) {
        await tracCore.tapProtocol.sleep(1)
    }

    console.log(i * 100, 'completed')

    // load chunks asynch. to perform parallel calls
    load()
}

/**
 * Slightly faster holders retrieval (transferables left out)
 *
 * @param ticker
 * @param offset
 * @param max
 * @returns {Promise<*[]|string>}
 */
async function getHoldersLite(ticker, offset = 0, max = 500) {

    let _ticker = JSON.stringify(ticker.toLowerCase());

    let out = [];
    let records = await tracCore.tapProtocol.getListRecords(
        "h/" + _ticker,
        "hi/" + _ticker,
        offset,
        max,
        false
    );

    if (!Array.isArray(records)) {
        return records;
    }

    for (let i = 0; i < records.length; i++) {
        out.push({
            address: records[i],
            balance: await tracCore.tapProtocol.getBalance(records[i], ticker)
        });
        await tracCore.tapProtocol.sleep(1);
    }

    return out;
}

/**
 * Formats a BigInt number as string to its decimal string representation based on the given decimals.
 *
 * @param string
 * @param decimals
 * @returns {string}
 */
function formatNumberString(string, decimals) {

    let pos = string.length - decimals;

    if(decimals == 0) {
        // nothing
    }else
    if(pos > 0){
        string = string.substring(0, pos) + "." + string.substring(pos, string.length);
    }else{
        string = '0.' + ( "0".repeat( decimals - string.length ) ) + string;
    }

    return string;
}

async function appendFile(path, buffer)
{
    try
    {
        await fs.promises.appendFile(path, buffer);
    } catch (e) { }
}
