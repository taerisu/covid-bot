const Discord = require('discord.js')
const translate = require('@iamtraction/google-translate')
const fetch = require('node-fetch')

require('dotenv').config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Захожу как: ${client.user.tag}!`)
  client.user.setActivity(`${process.env.PREFIX}covid - get info about covid`)
})

client.on('message', async message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return
	const args = message.content.slice(process.env.PREFIX.length).trim().split(' ')
	const command = args.shift().toLowerCase()

  if (command == 'covid') {
    let responseAll = await (await fetch('https://api.covid19api.com/summary')).json()

    // Make default request World
    let response = responseAll.Global
    response.Country = 'Мир'

    // Make request valid via translate
    let request = (await translate(args.join(' '), { to: "en" })).text.split(' ').join('-').toLowerCase()

    // Find request
    if (args) responseAll.Countries.forEach(country => {
      if (country.Slug == request) response = country
    })

    // Send result
		const Embed = new Discord.MessageEmbed()
      .setColor(process.env.BOT_COLOR)
      .setTitle(response.Country)
      .setURL('https://xn--80aesfpebagmfblc0a.xn--p1ai/')
      .addFields(
        { name: 'Новых заражений', value: response.NewConfirmed, inline: true },
        { name: 'Новых смертей', value: response.NewDeaths, inline: true },
        { name: 'Новых вылечено', value: response.NewRecovered, inline: true },
        { name: 'Всего заражений', value: response.TotalConfirmed, inline: true },
        { name: 'Всего смертей', value: response.TotalDeaths, inline: true },
        { name: 'Всего вылечено', value: response.TotalRecovered, inline: true }
      )
      .setTimestamp()

    message.channel.send(Embed);
	}
})

client.on('reconnecting', () => {
  console.log(`Захожу как: ${client.user.tag}!`)
  client.user.setActivity(`${process.env.PREFIX}covid - get info about covid`)
})

client.on('disconnect', () => {
  console.warn(`Вышел как: ${client.user.tag}!`)
})

client.login(process.env.TOKEN)