/**
 * @memberof Commands
 */

const postSlashCommand = require("../../tools/postSlashCommand.js");
const getDoujin = require("../../tools/getDoujin.js");

exports.load = async () => {

    // Send the slash command body
    var slashCommand = {
        "name": "nhentai",
        "description": "Search through NHentai",
        "options": [
            {
                "name":"get",
                "description":"Get doujin data",
                "type":2,
                "options": [
                    {
                        "name":"tags",
                        "description":"Get tags from a doujin",
                        "type":1,
                        "options": [
                            {
                                "name":"doujin",
                                "description":"The doujin ID",
                                "type":"3",
                                "required": true

                            }
                        ]
                    },
                    {
                        "name": "pages",
                        "description": "Get pages from a doujin",
                        "type": 1,
                        "options": [
                            {
                                "name": "doujin",
                                "description": "The doujin ID",
                                "type": "3",
                                "required": true

                            }
                        ]
                    }
                ]
            },
            {
                "name":"random",
                "type":1,
                "description":"Get a random doujin"
            }
        ]
    }
    var slashCommandResponse = await postSlashCommand({
        body: slashCommand,
        type: "guild",
        guildId: "601546489004556289"
    });
    // TODO : Logging system
    console.log(slashCommandResponse);

};

exports.run = async (context) => {   
    var options = context.data.options[0];
    var subcommand = options.name;
    // Respond depending on the subcommand
    if(subcommand == "random") {
        getDoujin().then((doujin) => {
            context.channel.send(`[${doujin.link}] Tags:**${doujin.details.tags.join(",")}**`)
        }).catch(() => {
            // No doujin found
        });
    }
    else if(subcommand == "get") {
        var getType = options.options[0];
	// In case get pages is requested
        if (getType.name == "pages") {
            var pageOptions = options.options[0].options;
            var doujinId = pageOptions[0].value.toString();
	    getDoujin(doujinId).then((doujin) => {
		     context.channel.send(doujin.details.pages);	
	    }).catch(()=>{
		// No doujin found
	    });
	// In case get tags is requestd
        } else if (getType.name == "tags") {
            var tagsOptions = options.options[0].options;
            var doujinId = tagsOptions[0].value;
	    getDoujin(doujinId).then((doujin)=>{
		    context.channel.send(doujin.details.tags.join(","))
	    }).catch(()=>{
		// No doujin found
	    });
        }
    }

}
exports.information = {
    "name": "nhentai",
    "description": "Search through NHentai"
}
