// DI.FM Alexa Skill Config File
// config file - alter this to reflect your setup

module.exports = {
	proxyServer : {
		// this is the external domain name that points to your DI.FM proxy server (over HTTPS)
		Url   : '<yourdomain>'
	},

	diFM : {
		// your premium listen key - found on bottom of www.di.fm/settings
		listenKey : '<ListenKeyHere>'
	},

	alexa : {
		// your skill api skill - found on skill Information panel 
		appID : '<Alexa API ID here>'
	}

}