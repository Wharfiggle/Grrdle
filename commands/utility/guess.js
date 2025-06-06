const { SlashCommandBuilder } = require("discord.js");

module.exports = 
{
	publicCommand: true, //WILL BE DEPLOYED GLOBALLY
	cooldown: 5,
	data: new SlashCommandBuilder().setName("guess")
	.setDescription("Guess a word, I will show only you the result.")
	.addStringOption(option =>
		option.setName("word").setDescription("The word to guess")),
	async execute(interaction)
	{
		var word = interaction.options.getString("word");
		if(!word || word == "")
			return await interaction.reply({content: "ahaha... um... you didn't type anything? yeah. fuck you.", ephemeral: true});
		else if(word.length < 5)
			return await interaction.reply({content: "Not long enough BUDDY.", ephemeral: true});
		
		const guessMarks = this.evaluateGuess(word);
		interaction.reply(guessMarks);
	},
	evaluateGuess(word)
	{
		return "fart";
	}
};