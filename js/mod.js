let modInfo = {
	name: "The ??? Tree",
	id: "zhangwei",
	author: "zhangwei",
	pointsName: "Star Particles",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Step One",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- First pass, 2 layers and a sublayer.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]


function getStartPoints(){
    return new Decimal(0)
}

// Determines if it should show points/sec
function canGenPoints(){
	return getBuyableAmount('s', 11)>0
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(hasUpgrade('s', 11)?1:.1).times(buyableEffect('s', 11)).times(upgradeEffect('s',22)).times(upgradeEffect('s',23));
  if(player['f'].best.gte(1)) gain = gain.times(player['f'].best.pow(1.02).times(1.15).plus(player['f'].best.sqrt().times(.15)));
  if(hasUpgrade('f',13)&&!hasUpgrade('f',23)) gain = gain.div(3);
  if(hasUpgrade('f',15)) gain = gain.times(upgradeEffect('f',15));
  if(hasUpgrade('f',24)) gain = gain.times(upgradeEffect('f',24))
  if(hasUpgrade('f',25)) gain = gain.times(upgradeEffect('f',25))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}