"use strict";

let Path = require('path');
let FS = require('fs');

let Barrier = require("./barrier");


module.exports = class DirectoryAnalyzer {
	constructor(inputDirectories, log) {
		this.inputDirectories = Object.keys(inputDirectories).map((type) => {
			return { type: type, path: inputDirectories[type] };
		});
		this.log = log;
		/**
		 * @example
		 * 	{
		 * 		children: {
		 * 			'Projects': {
		 * 				children: {
		 * 					AGV: {
		 * 						children: { ... },
		 * 						links: { ... }
		 * 					},
		 * 					'Todo-List': { ... }
		 * 				},
		 * 				links: {
		 * 					Documents: '/home/me/Documents/Modules',
		 * 					Pictures: '/home/me/Pictures/Modules'
		 * 				}
		 * 			}
		 * 		},
		 * 		links: {
		 * 			Documents: '/home/me/Documents',
		 * 			Pictures: '/home/me/Pictures'
		 * 		}
		 * 	}
		 * @type Object
		 */
		this.doxStructure = {};
		this.excludeFiles = ['node_modules', 'bin', 'src', 'dist', 'lib', '.git', '.idea'];
	}

	analyzeDirectory(path, type, doxStructure, log, barrier) {
		doxStructure.links = doxStructure.links || {};
		doxStructure.links[type] = path;

		FS.readdir(path, (error, items) => {
			if (error) {
				log(error);
			} else {
				barrier.expand(items.length);
				items.forEach((file) => {
					let absoluteFilePath = Path.join(path, file);
					if(this.excludeFiles.indexOf(file) >= 0) {
						barrier.finishedTask(absoluteFilePath);
					} else {
						FS.stat(absoluteFilePath, (error, meta) => {
							if (error) {
								log(error);
							} else {
								if (meta.isDirectory()) {
									doxStructure.children = doxStructure.children || {};
									doxStructure.children[file] = doxStructure.children[file] || {};
									this.analyzeDirectory(absoluteFilePath, type, doxStructure.children[file], log, barrier);
								} else {
									barrier.finishedTask(absoluteFilePath);
								}
							}
						});
					}
				});
			}
			barrier.finishedTask(path);
		});
	}

	analyze(callback) {
		let barrier = new Barrier(this.inputDirectories.length).then(
			() => { callback(this.doxStructure); }
		);
		this.inputDirectories.forEach((inputDirectory) => {
			this.analyzeDirectory(inputDirectory.path, inputDirectory.type, this.doxStructure, this.log, barrier);
		});
	}
};
