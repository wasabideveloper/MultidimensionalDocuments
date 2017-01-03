"use strict";

let Path = require('path');
let FS = require('fs');

let DirectoryAnalyzer = require("./directory-analyzer");

let userHome = process.env.HOME || process.env.USERPROFILE;
let processArgs = process.argv.slice(2);
let doxDirectory = processArgs[0] || Path.join(userHome, 'Dox');
let folderConfig = (processArgs[1])? JSON.parse(processArgs[1]) : {
	documents: Path.join(userHome, 'Documents'),
	images: Path.join(userHome, 'Pictures'),
	videos: Path.join(userHome, 'Videos')
};
let log = console.error;

let directoryAnalyzer = new DirectoryAnalyzer(doxDirectory, folderConfig, log);
