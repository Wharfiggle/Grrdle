module.exports = 
{
	publicCommand: true, //WILL BE DEPLOYED GLOBALLY
	cooldown: 5,
	data: SlashCommandBuilder().setName("Guess")
	.setDescription("Guess a word, I will show only you the result.")
	.addStringOption(option =>
		option.setName("word")
			.setDescription("The word to guess")
			.setRequired(false)),
	async execute(interaction)
	{
		var word = interaction.options.getString("word");
		this.guess(word);
	},
	guess(word)
	{
		if(!word)
		{
			//you didn't type anything... I'll assume you're just lonely.
		}
		else
		{
			//privately show results to guesser
		}
	}
};