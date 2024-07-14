const redis = require("redis"); 
const client = redis.createClient(); 
(async () => { 
	await client.connect(); 
})(); 
client.on("ready", () => { 
	console.log("Redis Connected!"); 
}); 
client.on("error", (err) => { 
	console.log("Error in the Connection"); 
}); 
module.exports = client