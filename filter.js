'use strict';

const fs = require('fs');

// HELP text
if (process.argv[2]) {
    const firstArg = process.argv[2].toLowerCase();
    if (firstArg === "-h" || firstArg == "--h") {
        console.log("USAGE");
        console.log("$ node filter.js <JSON_FILE> <WHITELIST_TXT_FILE> <IDENTIFIER>")
        console.log("- JSON_FILE is required - json file must be an array with objects, each containing specified identifier property")
        console.log("- WHITELIST_TXT_FILE is required - text file where each line is a string")
        console.log("- IDENTIFIER is optional - it defaults to \"name\" if not specified.")
        console.log("   use this if you ever need to filter by another property in the json file")
    
        console.log()
            
        console.log("OUTPUT")
        console.log("Program will generate a json file called \"filtered-json.json\" in the place where program was run.")
        console.log("Note: if you already have a file called \"filtered-json.json\" in same location, it will be overwritten.")
    
        console.log()
    
        console.log("EXAMPLES");
        console.log("- Defaults identifier to \"name\"")
        console.log("    $ node filter.js path/to/json.json /path/to/whitelist.txt ")
        console.log("- Uses identifier \"id\"")
        console.log("    $ node filter.js path/to/json.json /path/to/whitelist.txt id")
    
        process.exit()
    }
}

// argv[0] is node executable path
// argv[1] is path to this file
const jsonFilePath = process.argv[2];
const whitelistFilePath = process.argv[3];
const identifier = process.argv[4] || "name";
verifyArgs()

work();

////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////

function verifyArgs() {
    // json file
    if (jsonFilePath === undefined || jsonFilePath === null || jsonFilePath.trim() === "") {
        console.error("Error: json file path is required.")
        process.exit()
    }

    let fileExists = fs.existsSync(jsonFilePath)
    if (!fileExists) {
        console.error("Error: specified json file does not exist.")
        process.exit()
    }

    // whitelist file
    if (whitelistFilePath === undefined || whitelistFilePath === null || whitelistFilePath.trim() === "") {
        console.error("whitelist file path is required")
        process.exit()
    }

    fileExists = fs.existsSync(whitelistFilePath)
    if (!fileExists) {
        console.error("Error: specified whitelist file does not exist.")
        process.exit()
    }
}

// returns array of objects
function readJsonFile() {
    console.log("processing json file")
    const file = JSON.parse(fs.readFileSync(jsonFilePath).toString())
    return file;
}

// returns object of strings to booleans.
function readWhitelist() {
    console.log("processing whitelist")
    const lines = fs.readFileSync(whitelistFilePath).toString().split("\n")

    const obj = {}
    lines.forEach(line => obj[line.trim()] = true)
    return obj;
}

function work() {
    const whiteList = readWhitelist();
    const json = readJsonFile();

    const filteredJson = json.filter(obj => {
        const prop = obj[identifier]
        return whiteList[prop]
    })

    console.log("writing filtered-json.json to current path")

    const outputPath = `filtered-json.json`;
    const filteredJsonStr = JSON.stringify(filteredJson, null, 4);
    fs.writeFileSync(outputPath, filteredJsonStr);
}