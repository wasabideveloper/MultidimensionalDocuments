"use strict";

let Path = require('path');
let FS = require('fs');

let DirectoryAnalyzer = require("./directory-analyzer");

let userHome = process.env.HOME || process.env.USERPROFILE;
let processArgs = process.argv.slice(2);
let doxDirectory = processArgs[0] || Path.join(userHome, 'Dox');
let folderConfig = (processArgs[1])? JSON.parse(processArgs[1]) : {
	Documents: Path.join(userHome, 'Documents'),
	Images: Path.join(userHome, 'Pictures'),
	Videos: Path.join(userHome, 'Videos')
};
let log = console.error;

let directoryAnalyzer = new DirectoryAnalyzer(folderConfig, log);
directoryAnalyzer.analyze((doxStructure) => { log(JSON.stringify(doxStructure)); });
