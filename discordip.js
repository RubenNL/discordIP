process.chdir(__dirname);
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
	const channel=client.channels.cache.get(config.discordChannel);
	channel.startTyping();
	getIP()
		.then(ip=>channel.send("my ip:"+ip))
		.then(()=>channel.stopTyping())
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
let connected=true;
exports.stop=function () {
	client.destroy();
	connected=false;
}
exports.listening=function () {
	return connected;
}
