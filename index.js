const Discord = require('discord.js');
const fs      = require('fs');
require('dotenv').config();

const client = new Discord.Client();
client.login(process.env.TOKEN_ID).catch(() => {
  console.log('TOKEN_IDが間違ってます');
  process.exit();
});

// voiceList配下のファイル一覧を取得
const voiceList = fs.readdirSync('./voiceList');
// .gitkeepを除外
voiceList.shift();

// ボイス名一覧を取得
let voiceIndex = 0;
const voiceNameList = voiceList.map(voice => {
  let voiceName = voiceIndex + ' => ' + voice.split('.')[0];
  voiceIndex++;
  return voiceName;
});

console.log(voiceNameList);

let textChannel;
client.on('ready', () => {
  console.log('botの準備ができました');

  // bot用のテキストチャンネルが指定されている場合
  if (typeof process.env.TEXT_CHANNEL_ID !== 'undefined') {
    textChannel = client.channels.cache.get(process.env.TEXT_CHANNEL_ID);

    // bot用のテキストチャンネルに起動メッセージ送信
    if (textChannel) {
      textChannel.send('botを起動しました');
    } else {
      console.log('bot用のテキストチャンネルIDが間違ってます');
    }
  }
});

// メッセージ受信イベント
client.on('message', message => {
  // textChannelが定義されている場合はそのチャンネルからのメッセージのみ反応する
  // 定義されていない場合はどこからでも反応できるようにする
  if (!textChannel || message.channel.id === process.env.TEXT_CHANNEL_ID) {
    const sender        = message.member; // 送信者
    const voiceChannel  = sender.voice.channel; // 送信者の接続しているボイスチャンネル

    // メッセージが「.」から始まる場合botが反応する
    if (message.content.slice(0, 1) === '.') {

      let botMessage  = message.content.split('.')[1];
      botMessage      = Number.isInteger(botMessage) ? parseInt(botMessage, 10) : botMessage;
      console.log(botMessage);

      // メッセージ内容で何を処理するか判定
      if (botMessage === 'list') {
        // 「.list」で使用可能なコマンドを表示
        const listMessage = [];
        listMessage.push('「.」に続けて以下のメッセージを送信してください');
        listMessage.push('list => 一覧表示');
        listMessage.push('leave => ボイスチャンネルから退出');
        Array.prototype.push.apply(listMessage, voiceNameList);
        // メッセージ送信
        message.channel.send(listMessage);
      } else if (botMessage >= 0 && botMessage < voiceList.length) {
        // 指定されたボイス番号を再生
        if (voiceChannel) {
          // 同じボイスチャンネルに接続
          voiceChannel.join().then(connection => {
            // 指定された音声を再生
            connection.play('./voiceList/' + voiceList[botMessage]);
          });
        }
      } else if (botMessage === 'leave' && voiceChannel) {
        // 「.leave」でボイスチャンネルから退出
        voiceChannel.leave();
      }
    }
  }
});
