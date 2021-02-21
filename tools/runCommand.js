const findCommand = require("./findCommand.js");
const CommandsModule = require("../class/CommandsModule");
const replyInteraction = require("./replyInteraction.js");
/**
 * @typedef {Object} CommandData
 * @property {Object} options Command options 
 * @property {String} name Command name
 * @property {String} id Command id
 */

/**
 * @typedef {Object} CommandContext
 * @property {Object} channel Command execution channel
 * @property {Object} author Command executor
 * @property {Object} guild Command execution guild
 * @property {CommandData} data Command data
 * @property {String} timestamp Command request timestamp
 * @property {Object} context Raw command context
 */

/**
 * Run a given command name
 * @async
 * @param {String} comannd Command name
 * @param {CommandContext} commandContext Command context
 * @param {String} timestamp Execution timestamp
 */

async function runCommand (command, commandContext,timestamp) {

	// Parse interaction context
	var channelId = commandContext.channel_id || commandContext.channel.id;
	var author = commandContext.member || commandContext.author;
	var guild = commandContext.guild_id || commandContext.guild.id
	var data = commandContext.data;
	var context = {

		"channel" : await client.channels.fetch(channelId),
		"author": author,
		"guild": await client.guilds.fetch(guild),
		"data":data,
		"interaction":commandContext,
		"timestamp":timestamp

	}
	// TODO : Command Cooldown
	var moduleName = findCommand(command,CommandsModule.loadedModules);
	if(moduleName) { // If the command exists on the loaded modules
		var fetchedModule = CommandsModule.getModule(moduleName); // Get the CommandsModule object
		if(fetchedModule) { // Check if the given module name exists
			var fetchedCommand = fetchedModule.retrieveCommand(command);
			if(moduleName != "nsfw" || context.channel.nsfw) {
				fetchedCommand.run(context);
			} else {
				// Channel is not nsfw and nsfw type command was requested
				replyInteraction(context.interaction, {
					"type": 4,
					"content": `This is not a NSFW channel.`
				});
			}
		}

	}

}



module.exports = runCommand;
