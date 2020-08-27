const config = JSON.parse(require('fs').readFileSync('config.json','utf8'))
const Discord = require('discord.js');
const https=require('https')
const client = new Discord.Client();
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	sendIP();
});
client.on('message',message=>{
	if(message.channel.id!=config.discordChannel) return
	if(message.author==client.user) return;
	console.log(message)
	sendIP();
})
client.login(config.discordToken);
function sendIP() {
	getIP().then(ip=>client.channels.cache.get(config.discordChannel).send("my ip:"+ip))
}
function getIP() {
	return new Promise((resolve,reject)=>{
		https.get('https://api.ipify.org',res=>{
			let data='';
			res.on('data',chunk=>data+=chunk)
			res.on('end',()=>resolve(data))
		})
	})
}
