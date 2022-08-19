addLayer("s", {
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: true,
      points: new Decimal(0),
      b11m: new Decimal(1),
      b11d: new Decimal(1),
  //  best: new Decimal(0),
  //  total: new Decimal(0),
    }},
    color: "#ea5",
    branches: ['f'],
    requires() {
      let p = new Decimal(100)
      p = p.times(player.s.b11d)
      return p
    }, // Can be a function that takes requirement increases into account
    resource: "Star Shards", // Name of prestige currency
    baseResource: "Particles", // Name of resource prestige is based on
    baseAmount() {
      let p = player.points
      return p
    }, // Get the current amount of baseResource
    autoUpgrade(){return hasUpgrade('f',13)},
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){return new Decimal(0.55)}, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
      mult = new Decimal(1)
      if(hasUpgrade('f',14)) mult = mult.times(1.25)
      return mult
    },
    gainExp() { 
      return new Decimal(1)
    },
    effectDescription() { // Optional text to describe the effects
        return hasUpgrade('s', 14)?('which divide <span style="color:darkslategrey">Dust Bunny</span> cost by x'+format(upgradeEffect('s',14))):''
    },
     buyables: {
      11: {
        title: "Dust Bunny", 
        cost(x) { 
          let cost = getBuyableAmount('s', 11)<1?new Decimal(0):Decimal.pow(2, x.pow(1.25));
          if(hasUpgrade('s',14)) cost = cost.div(upgradeEffect('s',14));
          return cost.floor()
        },
        effect(x) { 
          return x.plus(tmp[this.layer].buyables[13].effect).times(.1).plus(1).times(player.s.b11m).times(tmp[this.layer].buyables[12].effect)
        },
        display() { 
          let data = tmp[this.layer].buyables[this.id]
          return "\n<h2>Amount</h2>: <b>" + getBuyableAmount('s', 11)+(getBuyableAmount('s', 13) >= 1?('+'+getBuyableAmount('s', 13)):'')+"</b>\n\
          <h2>Cost</h2>: " + format(data.cost) + " Star Particles\n\n\
          Generates Star Particles\n\
          Multiplies Star Particles by x" + format(data.effect)
        },
        unlocked() { return player[this.layer].unlocked }, 
        canAfford() {
          return player.points.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
          cost = hasMilestone('f',4)?0:tmp[this.layer].buyables[this.id].cost
          player.points = player.points.sub(cost)	
          player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
          player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) 
        },
      },
      12: {
        title: "Dust Helper", 
        cost(x) { 
          let cost = new Decimal(50).times(x.plus(1)).div(upgradeEffect('s',13)).pow((x.times(.05).plus(1)))
          return cost.floor()
        },
        effect(x) { 
          let mana = getBuyableAmount('s', 13); if(mana.gte(1)) mana = mana.times(2);
          return x.plus(mana).times(.5).times(upgradeEffect('s',21)).plus(1)
        },
        display() { 
          let data = tmp[this.layer].buyables[this.id]
          return "\n<h2>Amount</h2>: <b>" + getBuyableAmount('s', 12) + (getBuyableAmount('s', 13).gte(1)?('+'+getBuyableAmount('s', 13).times(hasUpgrade('f',12)?2:1)):'')+"</b>\n\
          <h2>Cost</h2>: " + format(data.cost) + " Star Shards\n\n\
          More efficient way to collect stardust\n\
          Makes Dust Bunnies better by x" + format(data.effect)
        },
        unlocked() { return getBuyableAmount('s', 11) >= 5}, 
        canAfford() {
          return player.points.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
          cost = hasMilestone('f',5)?0:tmp[this.layer].buyables[this.id].cost
          player.points = player.points.sub(cost)	
          player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
          player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) 
        },
      },
      13: {
        title: "Dust Manager", 
        cost(x) { 
          let cost = new Decimal(5).times(x.plus(1)).times(x.plus(1).log(15).plus(1)).pow(1.1+x*.05)
          return cost.floor()
        },
        effect(x) { 
          return getBuyableAmount('s', 13)
        },
        display() { 
          let data = tmp[this.layer].buyables[this.id]
          return "\n<h2>Amount</h2>: <b>" + getBuyableAmount('s', 13) + "</b>\n\
          <h2>Cost</h2>: " + format(data.cost) + " Star Shards\n\n\
          He keeps everything under control\n\
          Hires Dust Bunnies and Dust Helpers +" + format(data.effect)
        },
        unlocked() { return getBuyableAmount('s', 11) >= 8 && getBuyableAmount('s', 12) >= 8}, 
        canAfford() {
          return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
          cost = tmp[this.layer].buyables[this.id].cost;
          if(hasUpgrade('f',32)) cost = cost.div(2).floor();
          player[this.layer].points = player[this.layer].points.sub(cost)	
          player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
          player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) 
        },
      },
    },
    upgrades: {
      11: {
        title: "Stardust",
        description: "Dust Bunnies will collect nearby Stardust<br><br>Star Particles gain x10",
        unlocked:() => getBuyableAmount('s', 11) >= 2, // The upgrade is only visible when this is true
        canAfford:() => player.points.gte(10),
        currencyDisplayName: "Star Particles", // Use if using a nonstandard currency
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        cost: new Decimal(10),
      },
      12: {
        title: "Motivation",
        description: "Thank you for your hard work<br><br>Dust Bunnies are twice as effective",
        unlocked:() => getBuyableAmount('s', 11) >= 3, 
        canAfford:() => player.points.gte(40),
        currencyDisplayName: "Star Particles", 
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        onPurchase(){player.s.b11m = player.s.b11m.times(2)},
        cost: new Decimal(40),
      },
      13: {
        title: "Helping Hands",
        description:()=>"Helping each other makes the job faster<br><br>Dust bunnies make Dust Helpers cheaper<br><br>/"+format(upgradeEffect('s',13)),
        unlocked:() => getBuyableAmount('s', 11) >= 6, 
        canAfford:() => player.points.gte(200),
        currencyDisplayName: "Star Particles",
        effect:()=> hasUpgrade('s',13)?getBuyableAmount('s', 11).times(.2*(getBuyableAmount('s', 11)*.15+1)).plus(1):1,
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        cost: new Decimal(200),
      },
      14: {
        title: "Wages",
        description: "Motivation comes at a cost<br><br>Star Shards gain an effect",
        unlocked:() => getBuyableAmount('s', 12) >= 5, 
        canAfford:() => player.points.gte(500),
        currencyDisplayName: "Star Particles", 
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        effect(){
          if(hasUpgrade('s',24)) return player.s.points.plus(1).pow((getBuyableAmount('s', 11)*.01+1)).plus(1)
          return player.s.points.plus(1).log(1.33/(getBuyableAmount('s', 11)*.01+1)).plus(1)
        },
        cost: new Decimal(500),
      },
      15: {
        title: "Star Chunk",
        description: "A huge piece passing by means more Star Shards<br><br>Star shards are 10% cheaper",
        unlocked:() => getBuyableAmount('s', 11) >= 9 && getBuyableAmount('s', 12) >= 9, 
        canAfford:() => player.points.gte(1800),
        currencyDisplayName: "Star Particles", 
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        onPurchase(){player.s.b11d = player.s.b11d.times(.9)},
        cost: new Decimal(1800),
      },
      21: {
        title: "Helper Bunny",
        description:() => "Each Dust Bunny boosts Dust Helpes<br><br>x"+format(upgradeEffect('s',21)),
        unlocked:() => getBuyableAmount('s', 13) >= 2 && getBuyableAmount('s', 12) >= 10, 
        canAfford:() => player.points.gte(2100),
        effect:() => hasUpgrade('s',21)?getBuyableAmount('s',11).plus(tmp['s'].buyables[13].effect).times(.15).plus(1):1,
        currencyDisplayName: "Star Particles", 
        currencyInternalName:() => "points",
        currencyLocation:() => player,
        cost: new Decimal(2100),
      },
      22: {
        title: "Magnet",
        description:() => "This will probably attract more stardust<br><br>Bought buyables multiply Star Particles x"+format(upgradeEffect('s',22)),
        unlocked:() => getBuyableAmount('s', 13) >= 3 && getBuyableAmount('s', 12) >= 12, 
        effect:() => hasUpgrade('s',22)?getBuyableAmount('s',11).plus(getBuyableAmount('s',12)).plus(getBuyableAmount('s',13)).times(0.1).plus(1):1,
        cost: new Decimal(50),
      },
      23: {
        title: "Inventory",
        description:() => "Per upgrade, multiply Star Particle gain<br><br>x"+format(upgradeEffect('s',23)),
        unlocked:() => getBuyableAmount('s', 13) >= 6, 
        effect:() => hasUpgrade('s',23)?1+player.s.upgrades.length*.2:1,
        cost: new Decimal(250),
      },
      24: {
        title: "Better Wages",
        description:() => "They deserve it<br><br>Star Shard effect is better",
        unlocked:() => getBuyableAmount('s', 13) >= 8, 
        cost: new Decimal(500),
      },
      25: {
        title: "Capital",
        description:() => "Sell it all<br><br>Unlocks a new layer",
        unlocked:() => getBuyableAmount('s', 11) >= 15 && getBuyableAmount('s', 12) >= 25, 
        cost: new Decimal(1000),
      },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    update(d){
      if(hasMilestone('f',0)) buyBuyable('s',11);
      if(hasMilestone('f',1)) buyBuyable('s',12);
      if(hasMilestone('f',2)) buyBuyable('s',13);
      let rg = getResetGain('s');
      if(hasUpgrade('f',21)&&rg.gt(0)) player.s.points = player.s.points.plus(rg.times(d).times(player.f.passive.plus(buyableEffect('f',11).div(100))))
    },
    hotkeys: [
      {key: "s", description: "S: Reset for Star Shards", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
        "main-display",
        ["raw-html", function() {if(player.f.passive.gt(0)) return '(<span style="color:orange">'+format(getResetGain('s').times(player.f.passive.plus(buyableEffect('f',11).div(100))))+'/sec</span>)'}], "blank",
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],
    layerShown(){return true}
})

addLayer("f", {
    symbol: "￥",
    position: 0, 
    row: 1, 
    startData() { return {
      unlocked: false,
      points: new Decimal(0),
      best: new Decimal(0),
      total: new Decimal(0),
      resets: new Decimal(0),
      passive: new Decimal(0),
      ind:{
        ingots:new Decimal(0),
        shards:new Decimal(0),
        bp:new Decimal(0),
        factive:false,
        ingotGain(){
          let ing = new Decimal(1)
          if(hasUpgrade('f',31)) ing = ing.plus(upgradeEffect('f',31))
          return ing
        },
        icost(){return new Decimal(1000000)},
        bpmax(){return new Decimal(5).minus(buyableEffect('f',12))},
      },
    }},
    color: "silver",
    requires() {
      let p = new Decimal(1e6)
      return p
    }, 
    resource: "Funds", 
    baseResource: "Particles", 
    type: "static", 
    base: 10,
    exponent: .565,
    gainMult() { 
      let mult = new Decimal(1)
      return mult
    },
    gainExp() { 
      return new Decimal(1)
    },
    baseAmount() {
      let p = player.points
      return p
    }, 
    onPrestige(gain){
      player.f.resets = player.f.resets.plus(1);
    },
    canBuyMax(){
      return hasMilestone('f',3)
    },
    effectDescription() {
      let f = player[this.layer].best.pow(1.02).times(1.15).plus(player[this.layer].best.sqrt().times(.15)); if(f==0)f=1
      return 'which boost <span style="color:#ea5">Star Particles</span> gain by x'+format(f)
    },
    update(d){
      if(hasMilestone('f',6)){
        let ind = player.f.ind
        let icost = ind.icost();
        if(ind.shards.gte(icost)||ind.factive){
          let bpmax = ind.bpmax();
          ind.factive = true;
          ind.bp = ind.bp.plus(d);
          if(ind.bp.gte(bpmax)){
            ind.shards = ind.shards.minus(icost);
            ind.ingots = ind.ingots.plus(ind.ingotGain());
            ind.factive = false;
            player.f.ind.bp = new Decimal(0)
          }
        }
      }
    },
    upgrades: {
      11: {
        title: "Bunny Uniforms",
        description: "Helps in cold weather<br><br>Dust Bunnies are x1.33 stronger",
        unlocked:() => true,
        canAfford(){player[this.layer].points.gte(1)},
        cost: new Decimal(1),
        onPurchase(){player.s.b11m = player.s.b11m.times(1.33)},
      },
      12: {
        title: "Bunny Assistants",
        description: "Extra hands for the managers<br><br>Dust Managers hire extra Dust Helpers",
        unlocked:() => true,
        canAfford(){player[this.layer].points.gte(1)},
        cost: new Decimal(1),
      },
      13: {
        title: "Fat Bunny",
        description: "High maintanence<br><br>Autobuys Star Shard upgrades, but particle gain diveded by 3",
        unlocked:() => true,
        canAfford(){player[this.layer].points.gte(2)},
        cost: new Decimal(2),
      },
      14: {
        title: "The Mesh",
        description: "Sorts out stardust<br><br>Star Shard gain x1.25",
        unlocked:() => true,
        canAfford(){player[this.layer].points.gte(1)},
        cost: new Decimal(1),
      },
      15: {
        title: "Storage",
        description:()=> "Per upgrade, multiply Star Particle gain<br><br>x"+format(upgradeEffect('f',15)),
        unlocked:() => true,
        effect:() => hasUpgrade('f',15)?1+player.f.upgrades.length*.35:1,
        canAfford(){player[this.layer].points.gte(1)},
        cost: new Decimal(1),
      },
      21: {
        title: "Refinery Unit",
        description:()=> "Excellent purchase!<br><br>Refines Star Particles, generating 5% of Star Shards",
        unlocked:() => player.f.upgrades.length>=5,
        canAfford(){player[this.layer].points.gte(2)},
        onPurchase(){player.f.passive = player.f.passive.plus(.05)},
        cost: new Decimal(2),
      },
      22: {
        title: "Another Refinery Unit",
        description:()=> "Why did the price go up?<br><br>Generates another 5% of Star Shards",
        unlocked:() => player.f.upgrades.length>=6,
        canAfford(){player[this.layer].points.gte(3)},
        onPurchase(){player.f.passive = player.f.passive.plus(.05)},
        cost: new Decimal(3),
      },
      23: {
        title: "Threadmill",
        description:()=> "He needs it<br><br>Fat Bunny no longer divides particle gain",
        unlocked:() => player.f.upgrades.length>=7,
        canAfford(){player[this.layer].points.gte(4)},
        cost: new Decimal(4),
      },
      24: {
        title: "The Inspectors",
        description:()=> "Sort out stardust by purity<br><br>Star Particles boosts itself x"+format(upgradeEffect('f',24)),
        unlocked:() => player.f.upgrades.length>=8,
        canAfford(){player[this.layer].points.gte(6)},
        effect(){return player.points.plus(1).log(1200).plus(1)},
        cost: new Decimal(6),
      },
      25: {
        title: "Bronze Medal",
        description:()=> "Funds resets multiply particle gain by x"+format(upgradeEffect('f',25)),
        unlocked:() => player.f.upgrades.length>=8,
        canAfford(){player[this.layer].points.gte(10)},
        effect(){return player.f.resets.times(.1).plus(1).min(100)},
        cost: new Decimal(10),
      },
      31: {
        title: "Ingot Inspectors",
        description:()=> "The inspectors will now inspect the purity of the ingots. They know their stuff! <br><br> +"+format(upgradeEffect('f',31))+' ingot production',
        unlocked:() => hasMilestone('f',8),
        canAfford(){player[this.layer].points.gte(10)},
        effect(){return new Decimal(1)},
        cost: new Decimal(26),
      },
      32: {
        title: "Bribes",
        description:()=> "Ahem... Dust Managers only take half of the resources when bought",
        unlocked:() => player.f.points.gte(30)||hasUpgrade('f',32),
        canAfford(){player[this.layer].points.gte(30)},
        cost: new Decimal(30),
      },
    },
    milestones: {
      0: {
        requirementDescription: "1 Funds Reset",
        effectDescription: "Autobuy Dust Bunnies",
        done() {return player[this.layer].resets.gte(1)}, 
      },
      1: {
        requirementDescription: "2 Funds Resets",
        effectDescription: "Autobuy Dust Helpers",
        done() {return player[this.layer].resets.gte(2)}, 
      },
      2: {
        requirementDescription: "3 Funds Resets",
        effectDescription: "Autobuy Dust Managers",
        done() {return player[this.layer].resets.gte(3)}, 
      },
      3: {
        unlocked() {return hasMilestone(this.layer, 1)},
        requirementDescription: "5 Funds Resets",
        effectDescription: "You can buy max Funds",
        done() {return player[this.layer].resets.gte(5)}, 
      },
      4: {
        unlocked() {return hasMilestone(this.layer, 2)},
        requirementDescription: "8 Funds Resets",
        effectDescription: "Dust Bunnies cost nothing",
        done() {return player[this.layer].resets.gte(8)}, 
      },
      5: {
        unlocked() {return hasMilestone(this.layer, 3)},
        requirementDescription: "10 Funds Resets",
        effectDescription: "Dust Helpers cost nothing",
        done() {return player[this.layer].resets.gte(10)}, 
      },
      6: {
        unlocked() {return hasMilestone(this.layer, 4)},
        requirementDescription: "20 Funds",
        effectDescription: "Unlock Industries",
        done() {return player[this.layer].points.gte(20)}, 
      },
      7: {
        unlocked() {return hasMilestone(this.layer, 7)},
        requirementDescription: "10 Star Ingots",
        effectDescription: "Unlock something to spend ingots on",
        done() {return player[this.layer].ind.ingots.gte(10)}, 
      },
      8: {
        unlocked() {return hasMilestone(this.layer, 7)},
        requirementDescription: "25 Star Ingots and 25 Funds",
        effectDescription: "Furnace improvements",
        done() {return player[this.layer].ind.ingots.gte(25)&&player[this.layer].points.gte(25)}, 
      },
    },
    clickables:{
      11:{
        title(){return 'The Furnace'},
        display(){return "<br>Dump in all your star shards for smelting"},
        canClick(){return true},
        onClick(){
          if(player.s.points.eq(0)) return;
          player.f.ind.shards = player.f.ind.shards.plus(player.s.points); player.s.points = new Decimal(0); 
        },
      }
    },
    buyables: {
      11: {
        title: "Refinery Refinement", 
        cost(x) {
          let c = new Decimal(5).times(x).plus(x.times(2)).plus(4).pow(1.05)
          return c.floor()
        },
        effect() { 
          return player.f.buyables[11]
        },
        display() { 
          let data = tmp[this.layer].buyables[this.id]
          return "\n<h2>Amount</h2>: <b>"+getBuyableAmount('f', 11)+"</b>\n\
          <h2>Cost</h2>: " + format(data.cost) + " Star Ingots\n\n\
          Improves Refinery!\n\
          Extra +" + format(data.effect)+"% passive Star Shards"
        },
        unlocked() { return hasMilestone('f',7)}, 
        canAfford() {
          return player.f.ind.ingots.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
          let cost = tmp[this.layer].buyables[this.id].cost
          player.f.ind.ingots = player.f.ind.ingots.sub(cost)	
          player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
          player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) 
        },
      },
      12: {
        title: "Furnace Temperatures", 
        cost(x) {
          let c = new Decimal(5).times(x).plus(x.times(3)).plus(6).pow(1.1)
          return c.floor()
        },
        effect() { 
          return player.f.buyables[12].times(.1)
        },
        display() { 
          let data = tmp[this.layer].buyables[this.id]
          return "\n<h2>Amount</h2>: <b>"+getBuyableAmount('f', 12)+"</b>\n\
          <h2>Cost</h2>: " + format(data.cost) + " Star Ingots\n\n\
          Makes the Furnace hotter\n\
          Faster forging -" + format(data.effect)+"s"
        },
        unlocked() { return hasMilestone('f',8)}, 
        canAfford() {
          return player.f.ind.ingots.gte(tmp[this.layer].buyables[this.id].cost) && !player.f.buyables[12].gte(25)
        },
        buy() { 
          let cost = tmp[this.layer].buyables[this.id].cost
          player.f.ind.ingots = player.f.ind.ingots.sub(cost)	
          player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
          player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) 
        },
      },
    },
    hotkeys: [
      {key: "f", description: "F: Reset for Funds", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    bars: {
      ingotProgress: {
          direction: RIGHT,
          width: 200,
          height: 25,
          progress() {return player.f.ind.bp.div(player.f.ind.bpmax())},
      },
    },
    tabFormat: {
      "Main":{
        content:[
          "main-display",
          "prestige-button",
          "blank",
          "upgrades"
        ]
      },
      "Milestones":{
        content:[
          "main-display",
          ["raw-html", function() {return "Funds Resets: "+player.f.resets}],
          "blank",
          "milestones"
        ]
      },
      "Industries":{
        content:[
          ["raw-html", function() {return "<h2>You have "+format(player.f.ind.ingots)+" <span style='color:gold'>Star Ingots</span></h2>"}],
          "blank",
          ["raw-html", function() {if(player.f.ind.shards.gt(0)) return "Your <span style='color:#ea5'>Star Shard</span> bank is "+format(player.f.ind.shards)}], "blank",
          ["bar","ingotProgress"], "blank",
          "clickables", "blank",
          ["raw-html", function() {if(player.f.ind.shards.gt(0)) return "Ingot cost: <span style='color:orange'>"+format(player.f.ind.icost())+"</span><br>Ingot amount: <span style='color:orange'>"+format(player.f.ind.ingotGain())+"</span><br>Forging speed: <span style='color:orange'>"+format(player.f.ind.bpmax())+"s</span>"}], "blank",
          "buyables"
        ],
        unlocked(){return hasMilestone('f',6)},
      },
    },
    layerShown(){return hasUpgrade('s', 25)||player.f.resets.gte(1)}
});

