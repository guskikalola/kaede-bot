/** @module Commands */
const fs = require("fs");
class CommandNotFound extends Error {

	constructor(message) {
		super(message);
		this.name = "CommandNotFound";
	}

}

/**
 *
 * Creates a module to store commands and manage them
 *
 * @class
 * @classdesc Store commands in modules for easier management
 *
 * @author guskikalola <guskikalola@gmail.com>
 * @version 21.02.2021
 *
 */

class CommandsModule {
	static loadedModules = [];
	/**
	* Get a module by its name.
	* If module its not found, false will be returned.
	*
	* @param {String} moduleName
	*
	* @return {CommandModule}
	*
	*/
	static getModule(moduleName, callback) {
		var module = false;
		for(var i = 0, len = CommandsModule.loadedModules.length; i < len; i++) {

			var current = CommandsModule.loadedModules[i];
			if(current.moduleFolder == moduleName) {
				module = current;
				break;
			}

		}
		if(callback) callback(module);
		else return module;
	}
	/**
	 *
	 * Module commands are loaded dynamicaly
	 * from the module's folder. A module should
	 * only be configured once and then update by
	 * itself its command list
	 * @param {Object} config Module configuration
	 * @param {String} config.moduleFolder Name of module's folder containing the commands.
	 * @param {Boolean} config.activated Define if the module is activated. True by default
	 *
	 */
	constructor(config) {
		this.moduleFolder = config.moduleFolder;
		this.activated = config.activated || true;

		this.commands = new Map();	
		// Load the module's command files
		this.updateCommandList();
		// Save the module to loaded modules array
		CommandsModule.loadedModules.push(this);
	}
	
	/**
	 *
	 * Update the module's commands.
	 * This functions should not be called
	 * by hand.
	 *
	 */
	updateCommandList() {

		// Read the given module folder synchrounously
		var filenames = fs.readdirSync("./modules/"+this.moduleFolder);
		var path = "../modules/"+this.moduleFolder+"/";
		filenames.forEach(filename => {

			// If the file is a JS file then clear previous cache and load the command
			if(filename.toLowerCase().indexOf(".js") != -1) {
				// Remove the .js file ending
				var commandName = filename.replace(".js","");
				if(this.commands.has(commandName)) delete require.cache[path];
				// Store the cache on the commands map and load the command
				require(path + filename);	
				var absPath = process.cwd()+"/modules/"+this.moduleFolder+"/"+filename;
				this.commands.set(commandName, {cache:require.cache[require.resolve(absPath)]});
			}
		});

	}

	/**
	 * @typedef {Object} Information
	 * @property {String} name Command name
	 * @property {String} description Command description
	 * @property {String} usage Command usage
	 * @property {String} example Usage example
	 */

	/**
	 * @typedef {Object} Command
	 * @property {Information} info Command information
	 * @property {function} load Command initialization function
	 * @property {function} run Command execution function
	 * @property {String} path Command file absolute path
	 */

	/**
	 * Retrieve a command from the module.
	 * If the command doesn't exist or its not
	 * loaded on the module, it will raise CommandNotFound.
	 *
	 * @param {String} commandName The name of the requested command
	 * @return {Command}
	 */
	retrieveCommand(commandName) {
		var command = this.commands.get(commandName);
		// Check if the command is loaded on the module
		if(!command) {
			// The command is not loaded in the current module
			throw CommandNotFound(`Couldn't find command named [${commandName}] located at [${this.moduleFolder}]`);
		} else {

			return {
				"info": command.cache.exports.information,
				"load": command.cache.exports.load,
				"run": command.cache.exports.run,
				"path": command.cache.filename
			}

		}

	}
	/**
	 *
	 * Clears the cache of the command and loads its back.
	 * If this command doesn't exit or its not loaded on the module,
	 * CommandNotFound will be raised.
	 *
	 * @param {String} commandName Name of the command to reload
	 *
	 */
	reloadCommand(commandName) {

		var command = this.commands.get(commmandName);
		if(!command) {

			throw CommandNotFound(`Couldn't find command named [${commandName}] located at [${this.moduleFolder}]`);
		} else {

			// Clear the cache
			delete require.cache[command.path];
			// Cache the command and save the new cache
			require(command.path);
			this.commands.set(commandName, {cache:require.cache[command.path],path:command.path});
			// Load the command back
			var reloadedCommand = this.retrieveCommand(commandName);
			reloadedCommand.load();

		}

	
	}
	/**
	 *
	 * Runs the .load() function of all the module's loaded
	 * command.
	 *
	 *
	 */
	loadCommands() {
		this.commands.forEach(command => {
			command.cache.exports.load();
		});

	}
	static loadedModules = [];

}

module.exports = CommandsModule;
