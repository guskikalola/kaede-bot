/**
 * @memberof Commands
 */
const postSlashCommand = require("../../tools/postSlashCommand.js");
const replyInteraction = require("../../tools/replyInteraction.js");
const getDoujin = require("../../tools/getDoujin.js");
const { createCanvas, loadImage } = require('canvas');
exports.load = async () => {

    // Send the slash command body
    var slashCommand = {
        "name": "imhorny",
        "description": "Get a random set of doujins",
        "options": [
            {
            "name": "amount",
            "description": "amount of doujin to get (MAX 20)",
            "type": "4",
            "required": false,
            "choices": [
                {
                    "name": "Normalfag",
                    "value": 2
                },
                {
                    "name":"Weird",
                    "value": 4
                },
                {
                    "name":"Creep",
                    "value": 8
                },
                {
                    "name":"Degenerate",
                    "value":12
                },
                {
                    "name":"OH MY GOD",
                    "value":14
                },
                {
                    "name":"ASCENDED",
                    "value":20
                }
            ]

        }]
    }
    var slashCommandResponse = await postSlashCommand({
        body: slashCommand,
        type: "guild",
        guildId: "601546489004556289"
    });
    // TODO : Logging system
    console.log(slashCommandResponse);

};
exports.run = (context) => {
    var amount = 6;
    const HEIGHT = 240 * 2, WIDTH = 160 * 2;
    const doujins = [];
    
    if (context.data.options) amount = context.data.options[0].value; 
    
    /* Generate the horny set for the degenerate weeb */
    const hornySet = new Set();
    var sauces = "Sauces: ";

    var fetcher = setInterval(async () => {
        if (hornySet.size <= amount) { 
            var doujin = await getDoujin();
            if (doujin) {
                hornySet.add(doujin);
                var image = await loadImage(doujin.pages[0])
                doujins.push({thumbnail:image,id:doujin.bookId});
            }
        } else {
            clearInterval(fetcher);
            var ctx = createCanvas(WIDTH*amount/2,HEIGHT*2).getContext("2d");
            var col = 0,row=0, prog=0;
            doujins.forEach(doujin => {
                if(col >= amount/2) {col = 0; row++}
                ctx.drawImage(doujin.thumbnail,col*WIDTH,row*HEIGHT,WIDTH,HEIGHT);
                sauces += doujin.id + " ";
                col++;
                prog++;
            })
            replyInteraction(context.interaction,{
                type:"image",
                content:sauces,
                image: {
                    name:"horny.jpeg",
                    buffer: ctx.canvas.toBuffer('image/jpeg', { name: "horny.jpeg"})
                }
            })
        }
    }, 1000);
}
exports.information = {
    "name": "ping",
    "description": "Checks the bot's ping"
}
