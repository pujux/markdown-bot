const Discord = require('discord.js'),
  converter = new (require('showdown')).Converter(),
  imgMaker = require('node-html-to-image')

const client = new Discord.Client(),
	config = require('dotenv').config()

if (config.error) {
	console.warn('[ERROR]: cannot parse .env file')
	process.exit(-1)
}

client.once('ready', () => {
	console.log('[INFO]: bot is running')
	client.user.setActivity({ status: 'online', type: 3, name: 'your markdown', url: 'https://pufler.dev' })
})

client.on('message', async message => {
	if (message.content.startsWith('```md')) {
    const markdown = message.content.split('\n').splice(1).join('\n').replace(/`{3}.*/g, '').trim()
    const html = converter.makeHtml(markdown)
    const img = await imgMaker({ html, transparent: true })
    await message.channel.send(new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setColor('#303136')
      .attachFiles([new Discord.MessageAttachment(img, 'md.png')])
      .setImage('attachment://md.png')
      .setTimestamp())
  }
})

client.login(process.env.TOKEN)
