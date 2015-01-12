var randomNumber = function (max) {
	return Math.floor(Math.random() * max);
};

var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var pushAll = function (arr, items) {
	arr.splice.apply(arr, [arr.length, 0].concat(items));
};

var add = function (arr, item) {
	if (!~arr.indexOf(item)) arr.push(item);
};

var remove = function (arr, item) {
	var idx = arr.indexOf(item);
	if (~idx) arr.splice(idx, 1);
};

var randomItem = function (arr) {
	return arr[Math.floor(Math.random() * arr.length)];
};

var byProperty = function (key, value) {
	return function (obj) {
		return obj[key] === value;
	};
};

if (!Array.prototype.find) {
	Array.prototype.find = function (predicate) {
		if (this == null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

var findByProperty = function (arr, key) {
	return function (value) {
		return arr.find(byProperty(key, value));
	}
};

var instanstiate = function () {
	return new (this.bind.apply(this, [this].concat(slice(arguments))));
};

var preventDefault = function(method) {
	return function (event) {
		event.preventDefault();
		return method();
	}
};

var idCounter = 0;

var Card = function (options) {
	this.id = options.id || ++idCounter;
	this.name = options.name;
	this.female = !!options.female;
	this.money = !!options.money;
	this.requires = options.requires || null;
	this.minPlayers = options.minPlayers || 1;
	this.expansion = options.expansion || 0;
};

Card.prototype.toString = function () {
	return this.name;
};

var Deck = Array;

var Scenario = function (options) {
	this.id = options.id || ++idCounter;
	this.name = options.name;
	this.players = options.minPlayers || 6;
	this.expansion = options.expansion || 1;
	this._deck = options.deck;
};

Scenario.prototype.deck = function (options) {
	return this._deck(options).map(findByProperty(CARDS, "id"));
};

var EXPANSION_NAMES = [
	"Mascarade",
	"Mascarade Expansion"
];

var CARDS = [
	{id : "spy", name : "Spy", female: true, expansion : 0},
	{id : "bishop", name : "Bishop", expansion : 0},
	{id : "fool", name : "Fool", money : true, expansion : 0},
	{id : "inquisitor", name : "Inquisitor", minPlayers : 8, expansion : 0},
	{id : "judge", name : "Judge", expansion : 0},
	{id : "peasant1", name : "Peasant", requires : ["peasant2"], money : true, minPlayers : 8, expansion : 0},
	{id : "peasant2", name : "Peasant", requires : ["peasant1"], money : true, minPlayers : 8, expansion : 0},
	{id : "queen", name : "Queen", female: true, money : true, expansion : 0},
	{id : "king", name : "King", money : true, expansion : 0},
	{id : "witch", name : "Witch", female: true, expansion : 0},
	{id : "cheat", name : "Cheat", expansion : 0},
	{id : "widow", name : "Widow", female: true, money : true, expansion : 0},
	{id : "thief", name : "Thief", expansion : 0},
	{id : "alchemist", name : "Alchemist", expansion : 1},
	{id : "actress", name : "Actress", female: true, money : true, minPlayers : 8, expansion : 1},
	{id : "courtesan", name : "Courtesan", female: true, minPlayers : 8, expansion : 1},
	{id : "gambler", name : "Gambler", female: true, money : true, expansion : 1},
	{id : "puppetmaster", name : "Puppet Master", female: true, minPlayers : 6, expansion : 1},
	{id : "damned", name : "Damned", minPlayers : 8, expansion : 1},
	{id : "patron", name : "Patron", money : true, expansion : 1},
	{id : "beggar", name : "Beggar", female: true, expansion : 1},
	{id : "necromancer", name : "Necromancer", money : true, expansion : 1},
	{id : "princess", name : "Princess", female: true, money : true, minPlayers : 6, expansion : 1},
	{id : "sage", name : "Sage", money : true, minPlayers : 8, expansion : 1},
	{id : "usurper", name : "Usurper", money : true, minPlayers : 8, expansion : 1}
].map(instanstiate.bind(Card));

var SCENARIOS = [
	{name : "Beginner", expansion : 0, deck : function (options) {
		var deck = "judge,bishop,king,queen".split(",");
		if (options.players >= 7) deck.push("fool");
		if (options.players <= 4 || options.players === 7 || options.players >= 13) deck.push("thief");
		if (options.players >= 5) deck.push("witch");
		if (options.players >= 10) deck.push("spy");
		if (options.players >= 8) {
			deck.push("peasant1");
			deck.push("peasant2");
		}
		if (options.players <= 6 || options.players >= 9) deck.push("cheat");
		if (options.players >= 11) deck.push("inquisitor");
		if (options.players >= 12) deck.push("widow");
		return deck;
	}},
	{name : "Classic", expansion : 1, deck : function (options) {
		return "alchemist,spy,gambler,judge,patron,beggar,necromancer,puppetmaster,sage,princess,witch,cheat,actress".split(",").slice(0,Math.max(options.players, 8));
	}},
	{name : "Let it Roll!", expansion : 1, deck : function (options) {
		return "alchemist,fool,gambler,judge,necromancer,puppetmaster,bishop,inquisitor,princess,courtesan,cheat,sage,usurper".split(",").slice(0,Math.max(options.players, 8));
	}},
	{name : "Strength in Unity", expansion : 1, deck : function (options) {
		return "alchemist,actress,courtesan,sage,judge,puppetmaster,peasant1,peasant2,beggar,princess,inquisitor,fool,cheat".split(",").slice(0,Math.max(options.players, 8));
	}},
	{name : "Ultimate Combo", expansion : 1, deck : function (options) {
		return "alchemist,actress,inquisitor,judge,necromancer,princess,cheat,usurper,gambler,courtesan,damned,puppetmaster,patron".split(",").slice(0,Math.max(options.players, 8));
	}},
	{name : "Deadly Duel", expansion : 1, players : 2, deck : function (options) {
		return "bishop,gambler,judge,damned,queen,sage".split(",");
	}},
	{name : "The Infernal Trio", expansion : 1, players : 3, deck : function (options) {
		return "alchemist,bishop,gambler,judge,queen,sage".split(",");
	}}
].map(instanstiate.bind(Scenario));

/**
 * options.cards {Deck}
 * options.players {number}
 * options.extras {number}
 * options.ignoreJudge {boolean}
 * options.ignoreMinPlayers {boolean}
 * options.maxGraveyardCards {number}
 */

function generateDeck(options) {
	options = options || {};
	var cards = slice(options.cards || CARDS);
	var players = Math.max(options.players || 0, 2);
	var deck = new Deck();

	function addCard(card, pile) {
		if (card && !~deck.indexOf(card)) {
			deck.push(card);
			remove(cards, card);
			if (pile) remove(pile, card);
			if (card.requires) card.requires.map(findByProperty(cards, "id")).forEach(addCard);
		}
	}

	function addRandomCard(pile) {
		addCard(randomItem(pile), pile);
	}

	if (!options.ignoreMinPlayers) {
		cards = cards.filter(function (card) {
			return card.minPlayers <= players;
		});
	}

	players = Math.min(players, cards.length);
	var deckSize = Math.max(players + (options.extras || 0), 6);

	var judge = cards.find(byProperty("name", "Judge"));
	var deckHasJudge = false;
	if (judge) {
		if (!options.ignoreJudge || Math.random() <= deckSize / cards.length) {
			addCard(judge);
			deckHasJudge = true;
		}
		else remove(cards, judge);
	}

	var courtesan = cards.find(byProperty("name", "Courtesan"));
	var femaleCards = cards.filter(byProperty("female", true));
	var deckHasCourtesan = false;
	if (courtesan) {
		if (femaleCards.length >= Math.ceil(1/3 * players) && Math.random() <= deckSize / cards.length) {
			addCard(courtesan);
			deckHasCourtesan = true;
		}
		else remove(cards, courtesan);
	}

	var moneyCards = cards.filter(byProperty("money", true));
	var minMoneyCards = Math.ceil((deckHasJudge ? 1/3 : 2/3) * players);
	if (minMoneyCards >= moneyCards.length) pushAll(deck, moneyCards);
	else {
		for (var x = 0, xl = minMoneyCards; x < xl; ++x) {
			addRandomCard(moneyCards);
		}
	}

	if (deckHasCourtesan) {
		femaleCards = cards.filter(byProperty("female", true));
		var numberOfFemaleCardsInDeck = deck.filter(byProperty("female", true)).length;
		var minFemaleCards = Math.ceil(1/3 * players);
		for (var x = numberOfFemaleCardsInDeck, xl = minFemaleCards; x < xl; ++x) {
			addRandomCard(femaleCards);
		}
	}

	if (deckSize >= deck.length + cards.length) {
		pushAll(deck, cards);
		cards = new Deck();
	} else {
		while (deck.length < deckSize) {
			addCard(randomItem(cards));
		}
	}

	var graveyard = null;
	var deckHasNecromancer = !!deck.find(byProperty("name", "Necromancer"));
	if (deckHasNecromancer) {
		var graveyardSize = (options.maxGraveyardCards || Number.POSITIVE_INFINITY);
		if (graveyardSize >= cards.length) {
			graveyard = cards;
			cards = new Deck();
		}
		else {
			graveyard = new Deck();
			while (graveyard.length < graveyardSize) {
				var card = randomItem(cards);
				graveyard.push(card);
				remove(cards, card);
			}
		}
	}
	
	return {deck : deck, graveyard : graveyard};
}

var mdg = {
	vm : {
		players : m.prop(6),

		extras : m.prop(0),

		maxGraveyardCards : m.prop(6),

		ignoreJudge : m.prop(false),

		ignoreMinPlayers : m.prop(false),

		cards : m.prop(null),

		deck : m.prop(null),

		graveyard : m.prop(null),

		init : function () {
			this.cards(CARDS.map(function (card) {
				card = Object.create(card);
				card.selected = true;
				return card;
			}));
		},

		cardsByExpansion : function () {
			var expansions = [];
			this.cards().forEach(function (card) {
				if (!expansions[card.expansion]) expansions[card.expansion] = [card];
				else expansions[card.expansion].push(card);
			});
			return expansions;
		},

		options : function () {
			return {
				cards : this.cards().filter(byProperty("selected", true)),
				players : this.players(),
				extras : this.extras(),
				maxGraveyardCards : this.maxGraveyardCards(),
				ignoreJudge : this.ignoreJudge(),
				ignoreMinPlayers : this.ignoreMinPlayers()
			};
		},

		generateDeck : function () {
			var decks = generateDeck(this.options());
			this.deck(decks.deck);
			this.graveyard(decks.graveyard);

			setTimeout(function () {
				var decksElement = document.getElementById("decks");
				if (decksElement) decksElement.scrollIntoView();
			}, 100);
			
			return false;
		}
	},

	controller : function () {
		mdg.vm.init();
	},

	view : function () {
		var remainingCards = mdg.vm.cards().length - mdg.vm.players() - mdg.vm.extras();

		function cardView(card) {
			return m(".card", {key : card.id, "class" : "card-" + card.id}, [
				m("span.name", card.name),
				m("span.icons", [
					(card.minPlayers > 1 ? m("span.icon.minPlayers", card.minPlayers + "+") : ""),
					(card.money ? m("span.icon.money", "$") : ""),
					(card.requires ? m("span.icon.duplicate", "x" + (card.requires.length + 1)) : ""),
					(card.female ? m("span.icon.sex.female", m.trust("&#9792")) : m("span.icon.sex.male", m.trust("&#9794")))
				])
			]);
		}

		function convertArgToInt(callback) {
			return function (value) {
				return callback(parseInt(value, 10));
			}
		}

		return m(".container", [
			m(".page-header", [
				m("img[src='img/mascarade.jpg'][alt='Mascarade'][width=400][height=138]"),
				m("h1", "Deck Builder")
			]),
			m("form.row[name='settings']", [
				m(".col-md-6", [
					m(".arguments.form-horizontal", [
						m(".form-group", [
							m("label.control-label.col-sm-5[for='settingsPlayers']", "Players"),
							m(".col-sm-7", [
								m(".input-group", [
									m("input[id='settingsPlayers'][max='13'][min='2'][name='players'][required='required'][step='1'][type='range']", {value : mdg.vm.players(), oninput : m.withAttr("value", convertArgToInt(mdg.vm.players)), onchange : m.withAttr("value", convertArgToInt(mdg.vm.players))}),
									m("span.input-group-addon", mdg.vm.players())
								])
							])
						]),
						m(".form-group", [
							m("label.control-label.col-sm-5[for='settingsExtras']", "Extra Cards"),
							m(".col-sm-7", [
								m(".input-group", [
									m("input[id='settingsExtras'][max='2'][min='0'][name='extras'][required='required'][step='1'][type='range']", {value : mdg.vm.extras(), oninput : m.withAttr("value", convertArgToInt(mdg.vm.extras)), onchange : m.withAttr("value", convertArgToInt(mdg.vm.extras))}),
									m("span.input-group-addon", mdg.vm.extras())
								])
							])
						]),
						m(".form-group", [
							m("label.control-label.col-sm-5[for='settingsMaxGraveyardCards']", "Graveyard Cards"),
							m(".col-sm-7", [
								m(".input-group", [
									m("input[id='settingsMaxGraveyardCards'][min='0'][name='maxGraveyardCards'][step='1'][type='range']", {max : remainingCards, value : mdg.vm.maxGraveyardCards(), oninput : m.withAttr("value", convertArgToInt(mdg.vm.maxGraveyardCards)), onchange : m.withAttr("value", convertArgToInt(mdg.vm.maxGraveyardCards))}),
									m("span.input-group-addon", (mdg.vm.maxGraveyardCards() >= remainingCards ? "ALL" : mdg.vm.maxGraveyardCards()))
								])
							])
						]),
						m(".form-group", [
							m("label.control-label.col-sm-5", "Options"),
							m(".col-sm-7", [
								m(".checkbox", [
									m("label", [
										m("input[id='settingsIgnoreJudge'][name='ignoreJudge'][type='checkbox']", {checked : mdg.vm.ignoreJudge(), onchange : m.withAttr("checked", mdg.vm.ignoreJudge)}),
										"Ignore Judge Requirement"
									])
								]),
								m(".checkbox", [
									m("label", [
										m("input[id='settingsIgnoreMinPlayers'][name='ignoreMinPlayers'][type='checkbox']", {checked : mdg.vm.ignoreMinPlayers(), onchange : m.withAttr("checked", mdg.vm.ignoreMinPlayers)}),
										"Ignore Card's Minimum Players Requirement"
									])
								])
							])
						]),
						m(".actions.row", [
							m(".col-sm-offset-5.col-sm-7", [
								m("button.btn.btn-primary.generate", {onclick : preventDefault(mdg.vm.generateDeck.bind(mdg.vm))}, "Generate")
							])
						]),
						m(".actions.row", [
							m("label.control-label.col-sm-5", "Scenarios"),
							m(".col-sm-7", SCENARIOS.map(function (scenario) {
								return m("button.btn.btn-default.scenario", {"class" : "scenario-" + scenario.id, onclick : preventDefault(function () {
									mdg.vm.deck(scenario.deck(mdg.vm.options()));
								})}, scenario.name);
							}))
						])
					])
				]),
				m(".col-md-6", [
					m("label", "Cards"),
					m(".well.cardPacks", mdg.vm.cardsByExpansion().map(function (expansion, idx) {
						return m(".checkbox.cardPack", [
							m("input[type='checkbox']", {checked : expansion.some(byProperty("selected", true)), onchange : m.withAttr("checked", function (value) {
								expansion.forEach(function (card) {
									card.selected = value;
								});
							})}),
							m("span.packName", EXPANSION_NAMES[idx]),
							m(".packContents", expansion.map(function (card) {
								var ignored = !mdg.vm.ignoreMinPlayers() && card.minPlayers > mdg.vm.players();
								return m(".packCard", {"class" : (ignored ? "ignored" : "")}, [
									m("input[type='checkbox']", {checked : card.selected, onchange : m.withAttr("checked", function (value) {
										if (card.selected !== value) {
											card.selected = value;
											if (card.requires) card.requires.map(findByProperty(mdg.vm.cards(), "id")).forEach(function (card) {
												card.selected = value;
											});
										}
									})}),
									m("span", card.name),
									m("span.icons", [
										(card.minPlayers > 1 ? m("span.icon.minPlayers", card.minPlayers + "+") : ""),
										(card.money ? m("span.icon.money", "$") : ""),
										(card.requires ? m("span.icon.duplicate", "x" + (card.requires.length + 1)) : ""),
										(card.female ? m("span.icon.sex.female", m.trust("&#9792")) : m("span.icon.sex.male", m.trust("&#9794")))
									])
								])
							}))
						])
					}))
				])
			]),
			m(".donate", [
				m(".alert.alert-warning", [
					m("h4", "Find this tool useful? Like to see it continually supported?"),
					m("p", "I am a self-employed software developer who built this tool in my free time.\nUnfortunately, I can't work on stuff like this all the time as I have to make money to eat and live.\nWith your support, I can continue working on this and other great tools for board games that everyone can benefit from!"),
					m("form[action='https://www.paypal.com/cgi-bin/webscr'][method='post'][target='_blank']", [
						m("input[name='cmd'][type='hidden'][value='_s-xclick']"),
						m("input[name='hosted_button_id'][type='hidden'][value='TXJH2E9WT5KCJ']"),
						m("p.donate-line", [
							"Every little bit helps. So please, consider donating to my cause:",
							m("input.btn[alt='Donate via PayPal'][border='0'][name='submit'][src='https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif'][type='image']", {style: {"vertical-align": "middle"}})
						])
					]),
					m("p", "Thanks!")
				])
			]),
			(mdg.vm.deck() ?
				m("#decks.decks", [
					m(".cardContainer.deck", [
						m("h1", "Deck"),
						m(".cards", mdg.vm.deck().map(cardView))
					]),
					(mdg.vm.graveyard() ?
						m(".cardContainer.graveyard", [
							m("h1", "Graveyard"),
							m(".cards", mdg.vm.graveyard().map(cardView))
						])
					: "")
				])
			: ""),
			m(".page-footer", [
				m("p", m.trust("Mascarade and Mascarade Expansion are &copy 2014 REPOS PRODUCTION. ALL RIGHTS RESERVED.")),
				m("p", m.trust("Mascarade Deck Builder is &copy 2015 Gary Court. ALL RIGHS RESERVED. Licensed under the <a href='LICENSE'>BSD License</a>."))
			])
		]);
	}
};

m.module(document.body, mdg);