const { Console } = require('console');
var FormData = require('form-data');
const { Readable } = require('stream');

/**
 * Function used to reply to interaction events
 *
 * @param interaction
 * @param {Object} post Interaction response post configuration
 * @param {Number} [post[].type = 1] Type of response
 * @param {Object} post[].image[] Response image
 * @param {String} post[].image[].name Image name
 * @param {Buffer} post[].image[].buffer Image content buffer
 * @param {Boolean} [post[].tts = false] If response content is tts
 * @param {String} [post[].content = ""] Response message content
 * @param {Array} [post[].embeds = []] Response message's embeds
 * @param {Array} [post[].allowed_mentions = []] Response message's allowed mentions
 * 
 */

async function replyInteraction(interaction, post) {
	var postData = {
		"type": post.type || 1,
		"data": {
			"tts": post.tts || false,
			"content": post.content || "",
			"embeds": post.embeds || [],
			"allowed_mentions": post.allowed_mentions || []
		}
	}

	var response;
	var url = "https://discord.com/api/v8/webhooks/" + client.user.id + "/" + interaction.token;
	if (post.type == "image") {
		var form = new FormData();
		form.append("content", post.content);
		form.append("file", post.image.buffer, { header: '\r\n' + '--' + form.getBoundary() + '\r\n' + `Content-Disposition: attachment; filename="${post.image.name}` + '\r\n' + '\r\n'});
		form.submit(url, (err, res) => {
			if (err) throw err; 
		});
	} else {
		response = fetch(url, {
			"method": "POST",
			"body": JSON.stringify(postData.data),
			"headers": {
				"Authorization": "Bot " + process.env.TOKEN,
				"Content-Type": "application/json"
			}
		});
	}
}

module.exports = replyInteraction;
