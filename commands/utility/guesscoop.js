module.exports = 
{
	publicCommand: true, //WILL BE DEPLOYED GLOBALLY
	cooldown: 5,
	data: SlashCommandBuilder().setName("GuessCoop")
	.setDescription("Guess a word, I will display the results in this channel and anyone can participate.")
	.addStringOption(option =>
		option.setName("word")
			.setDescription("The word to guess")
			.setRequired(false)),
	async execute(interaction)
	{
		var word = interaction.options.getString("word");
		this.guess(word);
	},
	async executeManual(message, commandEndIndex)
	{
		var word;
		if(commandEndIndex != -1) //something typed after command
		{
			word = message.content.substring(commandEndIndex + 1);
			word = user.match(/\w/); //filter out non-letter characters
			if(!word || word.length < 5 ) //no letters or < 5 letters
				return;
		}
		else
			return;

		this.guess(word);
	},
	guess(word)
	{
		if(!word)
		{
			//Grrdle.
		}
		else
		{
			//display results
		}
	}
};