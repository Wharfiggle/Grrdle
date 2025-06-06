const { SlashCommandBuilder } = require("discord.js");

module.exports = 
{
	publicCommand: true, //WILL BE DEPLOYED GLOBALLY
	cooldown: 5,
	data: new SlashCommandBuilder().setName("guesscoop")
	.setDescription("Guess a word, I will display the results in this channel and anyone can participate.")
	.addStringOption(option =>
		option.setName("word").setDescription("The word to guess")),
	async execute(interaction)
	{
		var word = interaction.options.getString("word");
		if(!word || word == "")
			return await interaction.reply({content: "ahaha... um... you didn't type anything? yeah. fuck you.", ephemeral: true});
		else if(word.length < 5)
			return await interaction.reply({content: "Not long enough BUDDY.", ephemeral: true});
		
		this.guess(word, interaction);
	},
	async executeManual(message, commandEndIndex)
	{
		var word;
		if(commandEndIndex != -1) //something typed after command
		{
			word = message.content.substring(commandEndIndex + 1);
			//filter string with regex to only allow letters and numbers.
			word = (word.match(/\w/) || []).join(''); //no valid letters make .match return null so || [] supplies an empty set in that case
			
			if(word == "")
				return await message.reply("I'm gonna fucking kill you");
			else if(word.length < 5)
				return await message.reply("Not long enough bub.");
		}
		else
			return await message.reply("grrrr... RUFF RUFF RUFF.");

		this.guess(word, message);
	},
	guess(word, replier)
	{
		({ evaluateGuess } = require("./guess.js"));
		const guessMarks = evaluateGuess(word);
		replier.reply(guessMarks);
	}
};