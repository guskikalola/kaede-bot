/**
 * @typedef {Object} SlashCommand
 * @property {String} name Slash command name
 * @property {String} description Slash command description
 * 
 */
var globalCommands = () => {return `https://discord.com/api/v8/applications/${client.user.id}/commands`}
var guildCommands = (guild) => {return `https://discord.com/api/v8/applications/${client.user.id}/guilds/${guild}/commands`}
/**
 * Function used to post the slash commands to
 * the Discord API
 * 
 * @async
 * @param {Object} config
 * @param {String} config.type Whether it global o guild side command
 * @param {SlashCommand} config.body Slash commmand configuration body
 * @param {Number} [Number] config.guildId Optional if using guild commands
 *
 * @return {JSON} API response
 */
async function postSlashCommand(config) {
	var endpoint;
	if(config.type == "global") endpoint = globalCommands();
	else if(config.type == "guild") endpoint = guildCommands(config.guildId);
	else return false; // TODO : Error handler, in case config body is wrong

	var response = await fetch(endpoint, {
		method: "post",
		body: JSON.stringify(config.body),
		headers: {
			"Authorization": "Bot " + process.env.TOKEN,
			"Content-Type": "application/json"
		}
	});

	const json = await response.json();
	return json;

}

module.exports = postSlashCommand;
