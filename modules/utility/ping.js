/**
 * @memberof Commands
 */
const postSlashCommand = require("../../tools/postSlashCommand.js");
const replyInteraction = require("../../tools/replyInteraction.js");

exports.load = async () => {

	// Send the slash command body
	var slashCommand = {
		"name": "ping",
		"description":"Bot client ping",
		"options":[]
	}
	var slashCommandResponse = await postSlashCommand({
		body : slashCommand,
		type : "guild",
		guildId: "535168216217944067"
	});
	// TODO : Logging system
	console.log(slashCommandResponse);

};

exports.run = (context) => {
	replyInteraction(context.interaction, {
		"type":4,
		"content":`Pong! ${Date.now() - context.timestamp}ms`
	});
}
exports.information = {
	"name":"ping",
	"description":"Checks the bot's ping"
}
