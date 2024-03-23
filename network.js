
var wConnect = false
var connected = false
var ws

function getViews() {
	ws.send(JSON.stringify({getViews: true}))
}

function getClicks() {
	ws.send(JSON.stringify({getClicks: true}))
}

function sendMsg(sendData, bypass=false) {
	if (ws.readyState == WebSocket.OPEN && (connected || bypass)) {
		ws.send(JSON.stringify(sendData))
	}
}

function connectToServer() {
	if (ws) {
		if (ws.readyState == WebSocket.OPEN) {
			ws.close()
		}
	}
	console.log("Connecting...")
	connected = false
	ws = new WebSocket("wss://server.silverspace.online:443")
	ws.addEventListener("open", (event) => {
		ws.send(JSON.stringify({connect: "silver"}))
	})
	
	ws.addEventListener("message", (event) => {
		let msg = JSON.parse(event.data)
		if (msg.connected) {
			console.log("Connected")
            connected = true
			ws.send(JSON.stringify({view: id}))
		}
		if (msg.ping && !document.hidden) {
			ws.send(JSON.stringify({ping: true}))
		}
		if (msg.views) {
			console.log(JSON.stringify(msg.views))
		}
		if (msg.clicks) {
			console.log(JSON.stringify(msg.clicks))
		}
        if (msg.history) {
            chat = msg.history
        }
        if (msg.chat) {
            chat.push(msg.chat)
            if (chat.length > 100) {
				chat.splice(0, 1)
			}
        } 
        if (msg.deleteMsg) {
            chat.splice(msg.deleteMsg, 1)
        }
	})

	ws.addEventListener("close", (event) => {
		console.log("Disconnected")
		wConnect = true
	})
}

connectToServer()