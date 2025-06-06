const express = require("express");
const app = express();

app.listen(3005, () => 
{ console.log("Project is running!"); });

app.get("/", (req, res) => 
{ res.send("Hello world!"); });

// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
//this is called object destructuring
//creates a new const variable for each element in the {} and assigns them
//the values of the variables with the same names from the required module (discord.js)
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.commands = new Collection();
client.templates = [];
client.cooldowns = new Collection();

//set up all commands in commands folder
const foldersPath = path.join(__dirname, "commands"); //append "commands" to directory path to get path to commands folder
const commandFolders = fs.readdirSync(foldersPath); //get all folders in commands folder
for(const folder of commandFolders) //iterate through each folder in commands folder
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); //get all js files in folder
	for(const file of commandFiles)
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if(folder == "templates")
		{
			const name = file.substring(0, file.indexOf(".")); //file name with no extenstion
			client.commands.set(name, command);
			client.templates.push(name);
		}
		else if("data" in command && "execute" in command)
			client.commands.set(command.data.name, command);
		else
			//			V backticks, not apostrophes. Can only do string interpolation with backticks
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//set up all events in events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for(const file of eventFiles)
{
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if(event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
}



//		custom code for Grrdle

client.games = new Collection(); 		//format: {  "username", ["dater", "squib", ... ], [ ['y', 'g', null, null, 'y', 'y'], ... ]  }
client.coopGames = new Collection(); 	//format: {  "serverName", ["dater", "squib", ... ], [ ['y', 'g', null, null, 'y', 'y'], ... ]  }
client.word = "";

//read in first line of wordList.txt and set word to it
fs.readFile("wordList.txt", function(err, data) {
	if(err)
		return console.log("Error reading wordList.txt : " + err);
	data = data.ToString();
	const newLinePos = data.indexOf("\n");
	word = data.substring(0, newLinePos != -1 ? newLinePos : undefined);
});

const webhooks = new Collection();
client.on("messageCreate", async (message) =>
{
	var isWebhook = false;
	if(message.webhookId) //is a webhook
	{
		isWebhook = true;
		if(webhooks.find(wh => wh.id == message.webhookId)) //webhook is ours
			return;
	}

	//manual commands
	const prefixMatch = message.content.toLowerCase().match(/(i|I)? ?(G|g)uess:/);
	if(prefixMatch)
	{
		const prefix = prefixMatch[0];
		var commandEndIndex = message.content.indexOf(" ", prefix.length); //index of first space in string after prefix

		console.log(`Guess manually called by user \"${message.author.username}\" (user id: ${message.author})`);

		try
		{
			const commandGet = client.commands.get("guesscoop");
			if(commandGet)
				await commandGet.executeManual(message, commandEndIndex);
			return;
		}
		catch(error)
		{
			console.error(error);
			await message.reply({ content: "There was an error while executing this command!", ephemeral: true });
			return;
		}
	}
});



// Log in to Discord with your client's token
const { token } = require("./config.json");
client.login(token);
