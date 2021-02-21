var cache = new Map();

/**
 *
 * Searchs for a command name in the client's 
 * modules and returns the module name.
 *
 * @param {String} commandName Command name to search
 * @param {Array} modules Modules to search on for the command
 *
 * @return {String} Command module name
 *
 */

function findCommand (commandName, modules,callback) {

	// First, it searchs for the command in the cache
	var cachedCommand = cache.get(commandName);	
	if(cachedCommand) {
		// The command is cached and we can retrieve the module name from cache
	} else {
		// If the command's module name is not cached, search for the command
		for(var i = 0, len = modules.length; i < len; i++) {
			try { cachedCommand = modules[i].retrieveCommand(commandName) }
			catch (e) { if (e.name == "CommandNotFound") { /* Command was not on this module */} }
		}
		if (!cachedCommand) {
			// The command is not loaded or its unexistant
			return false;
		}
		cache.set(commandName, {path:cachedCommand.path});
	}
	var lastSlash;
	if (cachedCommand.path.lastIndexOf("/") == -1) lastSlash = cachedCommand.path.lastIndexOf("\\");
	else lastSlash = cachedCommand.path.lastIndexOf("/");
	var result = cachedCommand.path.slice(cachedCommand.path.lastIndexOf("modules") + "modules".length + 1, lastSlash);
	if(callback) callback(result); // If a callback function is given, call it instead of returning result
	else return result;

}


module.exports = findCommand;
