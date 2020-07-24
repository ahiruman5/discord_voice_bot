const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();
client.login(process.env.TOKEN_ID).catch(() => {
  console.log('TOKEN_IDが間違ってます');
  process.exit();
});

client.on('ready', () => {
  client.channels.cache.forEach(channelInfo => {
    if (channelInfo.type === 'text') {
      console.log(channelInfo.id + ' => サーバ名: ' + channelInfo.guild.name + ', テキストチャンネル名: ' + channelInfo.name);
    }
  });
  process.exit();
});
