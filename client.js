/**
 * 
 * Kaede's code rewrite project ( A.K.A Kaede V2 ) 
 *
 * @author guskikalola <guskikalola@gmail.com>
 * @version 04.02.2021
 *
 */

require("dotenv").config();
global.fetch = require("node-fetch");
global.fs = require("fs");
const runCommand = require(__dirname+"/tools/runCommand.js");
const CommandsModule = require(__dirname+"/class/CommandsModule.js");
const cfg = {

	token: process.env.TOKEN,
	db_host: process.env.DATABASE,
	owner_id: process.env.OWNER_ID

}

// TODO : Logging system

// TODO : Database connection

// Bot client creation
global.Discord = require("discord.js");
global.client = new Discord.Client();

// TODO : Modules setup
var modules = fs.readdirSync("./modules");
modules.forEach(module => {
	// Create a module for each subfolder on /modules folder
	new CommandsModule({ moduleFolder: module });
	console.log("Created module: " + module);
});



// TODO : Events setup 
client.on('ready',()=>{
	console.log("Client ready");
	CommandsModule.loadedModules.forEach(module => { 

		module.loadCommands();

	});
});
client.ws.on('INTERACTION_CREATE', async interaction => {

	var requestedTime = Date.now();
	var command = interaction.data.name;
	runCommand(command,interaction,requestedTime);
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 5 // AcknowledgeWithSource
		}
	})


});




// Client login
client.login(cfg.token);
