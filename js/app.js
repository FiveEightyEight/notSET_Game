// ---------- SET Logic ------------->>>

const set = (function() {
	const allCards = {};

	// BUILDERS

	const buildAllCards = () => {
		const colors = ["rd", "pp", "gr"];
		const shape = ["ov", "sq", "di"];
		const number = ["n1", "n2", "n3"];
		const shading = ["sd", "st", "ol"];
		const cards = [];

		for (let c = 0; c < colors.length; c++) {
			for (let s = 0; s < shape.length; s++) {
				for (let n = 0; n < number.length; n++) {
					for (let d = 0; d < shading.length; d++) {
						cards.push(`${colors[c]}${shape[s]}${number[n]}${shading[d]}`);
					}
				}
			}
		}

		return cards;
	};

	const buildCard = card_id => {
		const colors = {
			//['rd', 'pp', 'gr'];
			rd: "red",
			pp: "purple",
			gr: "green",
		};
		const shapes = {
			// ['ov', 'sq', 'di'];
			ov: "drop",
			sq: "star",
			di: "triangle",
		};
		const numbers = {
			// ['n1', 'n2', 'n3'];
			n1: "one",
			n2: "two",
			n3: "three",
		};
		const shadings = {
			// ['sd', 'st', 'ol'];
			sd: "solid",
			st: "striped",
			ol: "outlined",
		};

		const color = colors[`${card_id[0]}${card_id[1]}`];
		const shape = shapes[`${card_id[2]}${card_id[3]}`];
		const number = numbers[`${card_id[4]}${card_id[5]}`];
		const shading = shadings[`${card_id[6]}${card_id[7]}`];

		return {
			card_id,
			color,
			shape,
			number,
			shading,
		};
	};

	// <--- HELPER FUNCTIONS --> //
	const shuffle = array => {
		let currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	const ID = () => {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.

		// by https://gist.github.com/gordonbrander
		return Math.random()
			.toString(36)
			.substring(2, 11);
	};

	const objectifyTable = table => {
		// will convert the unique ids in state.table into objects,
		// store them  in state.table_state

		const objTable = [];

		for (let i = 0; i < table.length; i++) {
			// current id card is built, then pushed into the state
			// state.table_state.push(set.buildCard(table[i]));

			objTable.push(set.buildCard(table[i]));

			// adds a selected key to the card that was just built of false
			// state.table_state[state.table_state.length - 1]['selected'] = false;

			objTable[objTable.length - 1]["selected"] = false;
		}

		// render(state);
		return objTable;
	};

	const pushToAllDecks = (deck_id, cards) => {
		allDecks[deck_id] = {
			cards,
		};
	};

	const checkFeatures = (c1, c2, c3) => {
		if (c1 === c2 && c1 === c3) {
			return true;
		}
		if (c1 !== c2 && c1 !== c3 && c2 !== c3) {
			return true;
		}
		return false;
	};

	/*      <--- deck builder --->       */

	class Deck {
		constructor(deck_id, cards, remaining, discard) {
			(this.deck_id = deck_id),
				(this.cards = cards),
				(this.remaining = remaining),
				(this.discard = discard);
		}
	}

	const allDecks = {
		//     deck_id: {
		//         cards, // array of card object ids
		//     },
		//     deck_id2: {
		//         cards, // array of card object ids
		//     },
	};

	const buildDeck = (shuffled = false) => {
		if (shuffled) {
			const deck_id = ID();
			const cards = shuffle(buildAllCards());
			const remaining = cards.length;
			const shuffled = true;

			pushToAllDecks(deck_id, cards);

			return {
				deck_id,
				cards,
				remaining,
				shuffled,
			};
		} else {
			const deck_id = ID();
			const cards = buildAllCards();
			const remaining = cards.length;
			const shuffled = false;

			pushToAllDecks(deck_id, cards);

			return {
				deck_id,
				cards,
				remaining,
				shuffled,
			};
		}
	};

	const drawCard = (deck_id, count) => {
		if (!allDecks[deck_id]) {
			return null;
		}

		const drawn = [];
		for (let i = 0; i < count; i++) {
			drawn.push(allDecks[deck_id].cards.shift());
		}
		return drawn;
	};

	const display = () => {
		return allDecks;
	};

	const checkSet = (card1, card2, card3) => {
		for (let i = 0; i < 8; i += 2) {
			let c1ft = card1[i] + card1[i + 1];
			let c2ft = card2[i] + card2[i + 1];
			let c3ft = card3[i] + card3[i + 1];
			if (!checkFeatures(c1ft, c2ft, c3ft)) {
				return false;
			}
		}
		return true;
	};

	const checkTable = table => {
		if (table.length <= 2) {
			return false;
		}

		for (let i = 0; i < table.length - 2; i++) {
			// first card
			if (!table[i]) {
				continue;
			}
			let card1 = table[i];
			for (let j = i + 1; j < table.length - 1; j++) {
				// second card
				if (!table[j]) {
					continue;
				}
				let card2 = table[j];
				for (let k = i + 2; k < table.length; k++) {
					// third card
					if (!table[k]) {
						continue;
					}
					let card3 = table[k];
					if (checkSet(card1, card2, card3)) {
						return [card1, card2, card3];
					}
				}
			}
		}

		return false;
	};

	const play = (table, deck, noSet = false) => {
		if (noSet && table.length === 15) {
			for (let i = table.length; i < 18; i++) {
				const drawnCard = deck.shift();
				table.push(drawnCard);
			}

			return {
				table,
				deck,
				noSet,
			};
		} else if (noSet) {
			if (table.length < 15) {
				for (let i = table.length; i < 15; i++) {
					const drawnCard = deck.shift();
					table.push(drawnCard);
				}
			}
			return {
				table,
				deck,
				noSet,
			};
		} else if (table.includes(undefined) && table.length > 15) {
			//
			// After Player found a SET WITH 18 cards on the field
			// no cards will be drawn
			// any cards outside the array of 15 will be moved into the table/field

			newTable = [];
			for (let i = 0; i < 15; i++) {
				if (table[i] === undefined) {
					if (table[15]) {
						newTable.push(table[15]);
						table[15] = false;
					} else if (table[16]) {
						newTable.push(table[16]);
						table[16] = false;
					} else if (table[17]) {
						newTable.push(table[17]);
						table[17] = false;
					}
				} else {
					newTable.push(table[i]);
				}
			}

			table = newTable;

			return {
				table,
				deck,
				noSet,
			};
		} else if (
			table.includes(undefined) &&
			table.length > 12 &&
			table.length <= 15
		) {
			// Player found a SET after hitting NO SET
			// no cards will be drawn
			// any cards outside the array of 12 will be moved into the table/field

			newTable = [];
			for (let i = 0; i < 12; i++) {
				if (table[i] === undefined) {
					if (table[12]) {
						newTable.push(table[12]);
						table[12] = false;
					} else if (table[13]) {
						newTable.push(table[13]);
						table[13] = false;
					} else if (table[14]) {
						newTable.push(table[14]);
						table[14] = false;
					}
				} else {
					newTable.push(table[i]);
				}
			}

			table = newTable;

			return {
				table,
				deck,
				noSet,
			};
		} else if (table.includes(undefined)) {
			/*
            for (let i = table.length; i < 12; i++) {
                const drawnCard = deck.shift();
                table.push(drawnCard);
            };
            */
			for (let i = 0; i < 12; i++) {
				if (table[i] === undefined) {
					const drawnCard = deck.shift();
					table[i] = drawnCard;
				}
			}

			return {
				table,
				deck,
				noSet,
			};
		} else {
			if (table.length < 12) {
				/*
                   for (let i = table.length; i < 12; i++) {
                       const drawnCard = deck.shift();
                       table.push(drawnCard);
                   };
                   */
				for (let i = 0; i < 12; i++) {
					if (table[i] === undefined) {
						const drawnCard = deck.shift();
						table[i] = drawnCard;
					}
				}
			}
			return {
				table,
				deck,
				noSet,
			};
		}
	};

	// <<~~~~~~~~~~~~~~ Testing grounds ~~~~~~~~~~~~~~>>

	// SHUFFLED_DECK= shuffle(buildAllCards());

	// module.exports = {
	//     buildDeck,
	//     drawCard,
	//     display,
	//     checkTable,
	//     play,
	// };

	return {
		buildDeck,
		buildCard,
		objectifyTable,
		drawCard,
		display,
		checkTable,
		checkSet,
		play,
	};

	// rd    pp   gr
	// ov    sq   di
	// n1    n2   n3
	// sd    st   ol
})();

const infoMap = {
	rd: "red",
	pp: "purple",
	gr: "green",
	ov: "tear",
	sq: "star",
	di: "triangle",
	n1: "one",
	n2: "two",
	n3: "three",
	sd: "solid",
	st: "striped",
	ol: "outlined",
};

// ----- Global Variables ------------>>
// const set = require('./set.js');
const info = document.querySelector(".js-info");
const table = document.querySelector(".js-table");
let hand = {};

// ------------>>          ------------>>
// ------------>>  Storage ------------>>
// ------------>>          ------------>>

// ------------>>       *  *  *        ------------>>
// ------------>>  Functions & Helpers ------------>>
// ------------>>       *  *  *        ------------>>

const startNewGame = () => {
	state.rules = false;
	table.innerHTML = "";
	const newDeck = set.buildDeck(true);
	// const newDeck = set.buildDeck(); // FOR TESTING

	state.play = true;
	state.deck_id = newDeck.deck_id;
	state.deck = newDeck.cards;
	state.remaining = newDeck.remaining;
	state.table = [];
	state.table_state = [];

	render(state);
	draw();
	/*
    const play = set.play(state.table, state.deck);

    state.deck = play.deck;
    state.table = play.table;
    state.noSet = play.noSet;

    objectifyTable(state.table);
    render(state);
    */
};

const selectCard = index => {
	const currentCard = state.table_state[index];

	let keys = Object.keys(hand);
	switch (keys.length) {
		case 0:
			state.table_state[index].selected = true;
			hand[state.table_state[index].card_id] = index;
			render(state);
			break;

		case 1:
			if (!hand[currentCard.card_id]) {
				state.table_state[index].selected = true;
				hand[currentCard.card_id] = index;
			} else {
				delete hand[state.table_state[index].card_id];
				state.table_state[index].selected = false;
			}
			render(state);
			break;

		case 2:
			if (!hand[currentCard.card_id]) {
				state.table_state[index].selected = true;
				hand[currentCard.card_id] = index;

				// render(state);
				checkHand(complete => {
					if (complete) {
						draw();
					}
				});
			} else {
				delete hand[state.table_state[index].card_id];
				state.table_state[index].selected = false;
				render(state);
			}

			break;

		// case 3:

		// if (chkSet[currentCard.card_id]) {
		//     delete chkSet[state.table_state[index].card_id];
		//     state.table_state[index].selected = false;
		// }
		// render(state);
		// break;
	}
};

const checkHand = cb => {
	const keys = Object.keys(hand);
	let complete = false;

	if (set.checkSet(keys[0], keys[1], keys[2])) {
		// IT'S A SET!
		// The keys = the IDs of the SET of cards
		state.sets.push(keys);
		const newTable = [];
		const newTable_state = [];

		for (let i = 0; i < state.table.length; i++) {
			let currentCard = state.table[i];
			if (
				currentCard === keys[0] ||
				currentCard === keys[1] ||
				currentCard === keys[2]
			) {
				newTable.push(undefined);
				newTable_state.push(undefined);
			} else {
				newTable.push(currentCard);
				newTable_state.push(state.table_state[i]);
			}

			if (i === keys.length - 1) {
				complete = true;
			}
		}

		state.table = newTable;
		state.table_state = newTable_state;
		hand = {};
		// render(state);
		// console.log(`SET!`)
		// alert(`SET!`)
		cb(complete);
	} else {
		for (let i = 0; i < keys.length; i++) {
			const index = hand[keys[i]];
			state.table_state[index].selected = false;
		}
		hand = {};
		state.mistakes += 1;
		render(state);
		// console.log(`!SET`)
		// alert(`!SET`)
	}
};

const draw = (noSet = false) => {
	if (noSet && state.deck.length <= 0) {
		alert(`
        NO SETS REMAIN
         !!GAME OVER!!
        `);
		render(state);
		return;
	} else if (state.deck.length <= 0 && !set.checkTable(state.table)) {
		alert(`
        NO SETS REMAIN
         !!GAME OVER!!
        `);
		render(state);
		return;
	} else if (state.deck.length <= 0) {
		render(state);
		return;
	} else if (noSet) {
		table.innerHTML = "";

		const play = set.play(state.table, state.deck, noSet);
		state.table = [];
		state.table_state = [];
		// render(state);
		state.remaining = play.deck.length;
		state.deck = play.deck;
		state.table = play.table;
		state.noSet = play.noSet;

		state.table_state = set.objectifyTable(state.table);
		render(state);
	} else {
		table.innerHTML = "";

		const play = set.play(state.table, state.deck);
		state.table = [];
		state.table_state = [];
		// render(state);
		state.remaining = play.deck.length;
		state.deck = play.deck;
		state.table = play.table;
		state.noSet = play.noSet;

		state.table_state = set.objectifyTable(state.table);
		render(state);
	}
};

const checkField = state => {
	if (set.checkTable(state.table)) {
		state.mistakes += 1;
		render(state);
		alert(`THERE IS A SET!`);
	} else {
		// state.noSet = true;
		draw(true);
		// alert('this feature is in beta and not fully tested');
		// alert(`There is NO SET but I haven't implemented this yet lol`)
	}
};

// --------------- Tutorial Functions ------------- >>  //

const rules = () => {
	state.rules = true;
	// let tutPlay = set.buildDeck();
	// tutPlay = set.play(tutorial.table, tutPlay);

	// tutorial.deck = tutPlay.deck;
	// tutorial.table = tutPlay.table;
	// tutorial.table_state = set.objectifyTable(tutorial.table);

	/*
    tutorial = {
    page: 0,
    deck: [],
    table: [],
    table_state: [],
    }
    */
	render(state);
};

const renderTutorial = page => {
	switch (page) {
		case 0:
			return `

            ${tutChevron(page, "left")}
        
            <div class='mt-3 col-12 text-center content-center js-tut-slide'>
                <h1 class='fadeIn animated display-4'>Objective: </h1>
                <p class='fadeIn animated h5'>
                <span>The objective is to identify a <strong>'SET'</strong> of three cards from twelve cards laid out on the field.</span>
                <br>
                <span><u>Each</u> card has a variation of the following <strong><u>four features</u></strong>:</span>
                </p>
            </div>

            ${tutChevron(page, "left")}

        `;

		case 1:
			return `

            ${tutChevron(page)}
        
            <div class='col-12 text-center content-center js-tut-slide'>
                <h1 class='fadeIn animated display-4'><strong><em>Shape</em></strong></h1>
                <span class='text-muted'><em>[Feature]</em></span>

                ${tutExamples("ov", "di", "sq", true)}

                <hr>

                <h1 class='fadeIn animated display-4'><strong><em>Color</em></strong></h1>
                <span class='text-muted'><em>[Feature]</em></span>

                ${tutExamples("rd", "gr", "pp", true)}

                <hr>

                <h1 class='fadeIn animated display-4'><strong><em>Number</em></strong></h1>
                <span class='text-muted'><em>[Feature]</em></span>

                ${tutExamples("n1", "n2", "n3", true)}

                <hr>

                <h1 class='fadeIn animated display-4'><strong><em>Shading</em></strong></h1>
                <span class='text-muted'><em>[Feature]</em></span>

                ${tutExamples("sd", "st", "ol", true)}

            </div>

            

            ${tutChevron(page)}

        `;

		case 2:
			return `

            ${tutChevron(page)}
        
            <div class='col-12 text-center content-center js-tut-slide'>

            <h1 class='fadeIn animated display-4'><strong><em>Examples</em></strong></h1>

            <br>

            <p class='fadeIn animated h5'>
            A <strong>'SET'</strong> consists of <u>three</u> cards in which <u>each feature</u> is <strong>EITHER</strong> the same on each card <strong><em>OR</em></strong> is different on each card.
            <br> 
            That is to say, any feature in the <strong>'SET'</strong> of three cards is either common to all three cards or is different on each card.
            </p>

            ${tutExamples("rdsqn2ol", "rdsqn2st", "rdsqn2sd")}

            <p class='fadeIn animated h5'>
                The above example makes a <strong>'SET'</strong>, because each <em>feature</em> follows the rule.
                <br>
                <span><strong><u>Rule:</u></strong> Either all card share <em>this</em> feature, or they're all different.</span>
            </p>

            <hr>

            <p class='fadeIn animated h5'>

                Look at the individual features for each card below. 

            </p>
            ${tutExamples("grovn1ol", "grdin2st", "grsqn3sd")}
            
            <br>

            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">?</th>
                    <th scope="col">Shape</th>
                    <th scope="col">Color</th>
                    <th scope="col">Number</th>
                    <th scope="col">Shading</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">Card 1</th>
                    <td>Tear</td>
                    <td>Green</td>
                    <td>One</td>
                    <td>Outlined</td>
                    </tr>
                    <tr>
                    <th scope="row">Card 2</th>
                    <td>Triangle</td>
                    <td>Green</td>
                    <td>Two</td>
                    <td>Striped</td>
                    </tr>
                    <tr>
                    <th scope="row">Card 3</th>
                    <td>Star</td>
                    <td>Green</td>
                    <td>Three</td>
                    <td>Solid</td>
                    </tr>
                    <tr>
                    <th scope="row">FEATURE: </th>
                    <td><strong>ALL DIFFERENT</strong></td>
                    <td><strong>ALL SAME</strong></td>
                    <td><strong>ALL DIFFERENT</strong></td>
                    <td><strong>ALL DIFFERENT</strong></td>
                    </tr>
                </tbody>
            </table>

            <p class='fadeIn animated h5'>

                The cards above followed the rules for <em>EACH</em> feature. Therefore they make a <em>'SET'.</em>
                <br>

                Each feature was either different between each card <strong>OR</strong> they <strong>ALL</strong> shared it.

            <p>



            </div>

            ${tutChevron(page)}

        `;

		case 3:
			return `

            ${tutChevron(page)}
        
            <div class='col-12 text-center content-center js-tut-slide'>

            <h1 class='fadeIn animated display-4'><strong><em>Examples</em></strong></h1>

            ${tutExamples("ppovn2sd", "ppovn3sd", "rdovn1sd")}

            <p class='fadeIn animated h5'>
                
                These cards <strong><em>DO NOT</em></strong> make a set.
                
            </p>

            <table class="table">
            <thead>
                <tr>
                <th scope="col">?</th>
                <th scope="col">Shape</th>
                <th scope="col">Color</th>
                <th scope="col">Number</th>
                <th scope="col">Shading</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">Card 1</th>
                <td>Tear</td>
                <td class='bg-warning'>Purple</td>
                <td>Two</td>
                <td>Solid</td>
                </tr>
                <tr>
                <th scope="row">Card 2</th>
                <td>Tear</td>
                <td class='bg-warning'>Purple</td>
                <td>Three</td>
                <td>Solid</td>
                </tr>
                <tr>
                <th scope="row">Card 3</th>
                <td>Tear</td>
                <td class='bg-warning'>Red</td>
                <td>One</td>
                <td>Solid</td>
                </tr>
                <tr>
                <th scope="row">FEATURE: </th>
                <td><strong>ALL SAME</strong></td>
                <td class='text-danger'><strong>2 SAME 1 DIFFERENT</strong></td>
                <td><strong>ALL DIFFERENT</strong></td>
                <td><strong>ALL SAME</strong></td>
                </tr>
            </tbody>
        </table>



            <hr>
            <br>

            ${tutExamples("grovn1ol", "grovn2st", "grsqn3sd")}

            <p class='fadeIn animated h5'>
                
                These cards <strong><em>DO NOT</em></strong> make a set.
                
            </p>

            <table class="table">
            <thead>
                <tr>
                <th scope="col">?</th>
                <th scope="col">Shape</th>
                <th scope="col">Color</th>
                <th scope="col">Number</th>
                <th scope="col">Shading</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">Card 1</th>
                <td class='bg-warning'>Tear</td>
                <td>Green</td>
                <td>One</td>
                <td>Outlined</td>
                </tr>
                <tr>
                <th scope="row">Card 2</th>
                <td class='bg-warning'>Tear</td>
                <td>Green</td>
                <td>Two</td>
                <td>Striped</td>
                </tr>
                <tr>
                <th scope="row">Card 3</th>
                <td class='bg-warning'>Star</td>
                <td>Green</td>
                <td>Three</td>
                <td>Solid</td>
                </tr>
                <tr>
                <th scope="row">FEATURE: </th>
                <td class='text-danger'><strong>2 SAME 1 DIFFERENT</strong></td>
                <td><strong>ALL SAME</strong></td>
                <td><strong>ALL DIFFERENT</strong></td>
                <td><strong>ALL DIFFERENT</strong></td>
                </tr>
            </tbody>
        </table>


        <hr>
        <br>

        ${tutExamples("ppdin3ol", "ppdin3st", "rddin3st")}

            <p class='fadeIn animated h5'>
                
                These cards <strong><em>DO NOT</em></strong> make a set.
                
            </p>

            <table class="table">
            <thead>
                <tr>
                <th scope="col">?</th>
                <th scope="col">Shape</th>
                <th scope="col">Color</th>
                <th scope="col">Number</th>
                <th scope="col">Shading</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">Card 1</th>
                <td>Triangle</td>
                <td class='bg-warning'>Purple</td>
                <td>Three</td>
                <td class='bg-warning'>Outlined</td>
                </tr>
                <tr>
                <th scope="row">Card 2</th>
                <td>Triangle</td>
                <td class='bg-warning'>Purple</td>
                <td>Three</td>
                <td class='bg-warning'>Striped</td>
                </tr>
                <tr>
                <th scope="row">Card 3</th>
                <td>Triangle</td>
                <td class='bg-warning'>Red</td>
                <td>Three</td>
                <td class='bg-warning'>Striped</td>
                </tr>
                <tr>
                <th scope="row">FEATURE: </th>
                <td><strong>ALL SAME</strong></td>
                <td class='text-danger'><strong>2 SAME 1 DIFFERENT</strong></td>
                <td><strong>ALL SAME</strong></td>
                <td class='text-danger'><strong>2 SAME 1 DIFFERENT</strong></td>
                </tr>
            </tbody>
        </table>

            </div>

            ${tutChevron(page)}

        `;

		case 4:
			return `

            ${tutChevron(page, "right")}
        
            <div class='col-12 text-center content-center js-tut-slide'>

            <h1 class='fadeIn animated display-4'><strong><em>Examples</em></strong></h1>
                
            ${tutExamples("rdovn1sd", "grdin2st", "ppsqn3ol")}

            <hr>

            ${tutExamples("ppovn2st", "rddin3ol", "grsqn1sd")}

            <hr>

            ${tutExamples("grovn3ol", "ppdin1sd", "rdsqn2st")}

            <span><em>Note: These are all sets</em></span>

            </div>

            ${tutChevron(page, "right")}

        `;

		case 5:
			return `
        
            ${tutChevron(page, "right")}
            <div class='col-12 text-center content-center js-tut-slide'>

                ${tutExamples("sd", "n2", "sq", true)}

            </div>
            ${tutChevron(page, "right")}
        
        
        `;

		case 6:
			return `
        
        
        `;

		case 7:
			return `
        
        `;

		case 8:
			return `
        

        `;
	}
};

const tutChevron = (page, disabled) => {
	if (disabled === "left") {
		return `
        <div class="row col-12 content-center p-2">

            <div class='col-12'>

                <a class='btn btn-light py-1 pl-3 pr-2 disabled js-chev-left' style='font-size: 2rem'> 
                    <i class="fas fa-chevron-left js-chev-left"></i> 
                </a>

                <span class='mb-5 pb-2'>Page: ${page + 1}</span>

                <a class='btn btn-light py-1 pr-3 pl-2 js-chev-right'  style='font-size: 2rem'> 
                    <i class="fas fa-chevron-right js-chev-right"></i> 
                </a>

            </div>
            
        
        </div>
    
    `;
	} else if (disabled === "right") {
		return `
        <div class="row col-12 content-center p-2">

            <div class='col-12'>

                <a class='btn btn-light py-1 pl-3 pr-2 js-chev-left' style='font-size: 2rem'> 
                    <i class="fas fa-chevron-left js-chev-left"></i> 
                </a>

                <span class='mb-5 pb-2'>Page: ${page + 1}</span>

                <a class='btn btn-light py-1 pr-3 pl-2 disabled js-chev-right'  style='font-size: 2rem'> 
                    <i class="fas fa-chevron-right js-chev-right"></i> 
                </a>

            </div>
            
        
        </div>
    
    `;
	} else {
		return `
        <div class="row col-12 content-center p-2">

            <div class='col-12'>

                <a class='btn btn-light py-1 pl-3 pr-2 js-chev-left' style='font-size: 2rem'> 
                    <i class="fas fa-chevron-left js-chev-left"></i> 
                </a>

                <span class='mb-5 pb-2'>Page: ${page + 1}</span>

                <a class='btn btn-light py-1 pr-3 pl-2 js-chev-right'  style='font-size: 2rem'> 
                    <i class="fas fa-chevron-right js-chev-right"></i> 
                </a>

            </div>
            
        
        </div>
    
    `;
	}
};

const tutExamples = (ex1, ex2, ex3, features = false) => {
	if (features) {
		return `

            <div class='row'>
                <div class="col-4 text-center py-3">
                    <img src='assets/images/cards/tutorial/tut${ex1.toUpperCase()}.png' class='fadeIn animated col-12'>
                    <span class='h4'>${infoMap[ex1].toUpperCase()}</span>
                </div>

                <div class="col-4 text-center py-3">
                    <img src='assets/images/cards/tutorial/tut${ex2.toUpperCase()}.png' class='fadeIn animated col-12'>
                    <span class='h4'>${infoMap[ex2].toUpperCase()}</span>
                </div>

                <div class="col-4 text-center py-3">
                    <img src='assets/images/cards/tutorial/tut${ex3.toUpperCase()}.png' class='fadeIn animated col-12'>
                    <span class='h4'>${infoMap[ex3].toUpperCase()}</span>
                </div>
            </div>
        `;
	} else {
		ex1 = set.buildCard(ex1);
		ex2 = set.buildCard(ex2);
		ex3 = set.buildCard(ex3);
		return `

            <div class='row'>
                <div class="col-4 text-center py-3">
                    
                    <img src='assets/images/cards/${
											ex1.card_id
										}.png' class='fadeIn animated col-12'>

                    <ul class="py-2 px-3 list-group">
                        <li class="list-group-item">Shape: <strong>${ex1.shape.toUpperCase()}</strong></li>
                        <li class="list-group-item">Color: <strong>${ex1.color.toUpperCase()}</strong></li>
                        <li class="list-group-item">Number: <strong>${ex1.number.toUpperCase()}</strong></li>
                        <li class="list-group-item">Shading: <strong>${ex1.shading.toUpperCase()}</strong></li>
                    </ul>
                </div>

                <div class="col-4 text-center py-3">
                     
                    <img src='assets/images/cards/${
											ex2.card_id
										}.png' class='fadeIn animated col-12'>
                   
                    <ul class="py-2 px-3 list-group">
                        <li class="list-group-item">Shape: <strong>${ex2.shape.toUpperCase()}</strong></li>
                        <li class="list-group-item">Color: <strong>${ex2.color.toUpperCase()}</strong></li>
                        <li class="list-group-item">Number: <strong>${ex2.number.toUpperCase()}</strong></li>
                        <li class="list-group-item">Shading: <strong>${ex2.shading.toUpperCase()}</strong></li>
                    </ul>
                </div>

                <div class="col-4 text-center py-3">

                    <img src='assets/images/cards/${
											ex3.card_id
										}.png' class='fadeIn animated col-12'>

                    <ul class="py-2 px-3 list-group">
                        <li class="list-group-item">Shape: <strong>${ex3.shape.toUpperCase()}</strong></li>
                        <li class="list-group-item">Color: <strong>${ex3.color.toUpperCase()}</strong></li>
                        <li class="list-group-item">Number: <strong>${ex3.number.toUpperCase()}</strong></li>
                        <li class="list-group-item">Shading: <strong>${ex3.shading.toUpperCase()}</strong></li>
                    </ul>

                </div>
            </div>
            
        `;
	}
};

// ------------>>          ------------>>
// ------------>>  Events  ------------>>
// ------------>>          ------------>>

info.addEventListener("click", e => {
	if (e.target.matches(".js-new-game")) {
		// start new game
		startNewGame();
	} else if (e.target.matches(".js-no-set")) {
		// check if no there is no set
		console.log(`checking field`);
		checkField(state);
	} else if (e.target.matches(".js-rules")) {
		// render rules and tutorial button
		rules();
	} else if (e.target.matches(".js-chev-left")) {
		if (tutorial.page > 0) {
			tutorial.page -= 1;
			render(state);
		}
	} else if (e.target.matches(".js-chev-right")) {
		if (tutorial.page < 4) {
			tutorial.page += 1;
			render(state);
		}
	}
});

document.addEventListener("keyup", e => {
	if (e.keyCode === 37 && state.rules) {
		// left
		if (tutorial.page > 0) {
			tutorial.page -= 1;
			render(state);
		}
	} else if (e.keyCode === 39 && state.rules) {
		// right

		if (tutorial.page < 4) {
			tutorial.page += 1;
			render(state);
		}
	}
});

table.addEventListener("click", e => {
	if (e.target.matches(".js-card")) {
		const index = e.target.getAttribute("data-index");

		selectCard(index);
	}
});

// ------------>>          ------------>>
// ------------>>  State   ------------>>
// ------------>>          ------------>>

let state = {
	rules: false,
	play: false,
	deck_id: "",
	deck: [],
	table: [],
	table_state: [],
	sets: [],
	remaining: 0,
	noSet: false,
	mistakes: 0,
};

const tutorial = {
	page: 0,
	deck: [],
	table: [],
	table_state: [],
};

// ------------>>          ------------>>
// ------------>>  Render  ------------>>
// ------------>>          ------------>>

const render = state => {
	if (!state.play) {
		// game hasn't started

		if (state.rules) {
			info.innerHTML = `
            <a class="btn btn-danger btn-lg js-new-game" href="#" role="button">New Game</a>
            <div class="col-12 p-2">
                    
            </div>

            <div class='row bg-light border js-tutorial'>

                ${renderTutorial(tutorial.page)}

            </div>

            `;
		} else {
			info.innerHTML = `

            <a class="btn btn-danger btn-lg js-new-game" href="#" role="button">New Game</a>
            <div class="col-12 p-2">
            <a class="btn btn-secondary rounded-pill px-4 bounceInUp animated js-rules" style="font-size: 2rem; color: white;"> <i class="fas fa-question js-rules"></i> </a>
            </div>

        `;
		}
	} else if (state.play) {
		// game has started
		info.innerHTML = `
        <a class="btn btn-warning btn-lg js-no-set" href="#" role="button"><strong class='js-no-set'>NO SET</strong></a>
        <a class="btn btn-danger btn-lg js-new-game" href="#" role="button">New Game</a>

        <p class='pt-4 h6 font-weight-bold'>Deck ID: ${state.deck_id}</p>
        <p class='h6 font-weight-bold'>Cards Left in Deck: ${
					state.remaining
				}</p>

        <span class='pt-1 px-2 h5 font-weight-bold'>Score: ${state.sets.length -
					state.mistakes}</span>
        <span class='pt-1 px-2 h5 font-weight-bold'>Sets Made: ${
					state.sets.length
				}</span>

        `;

		// if table state has any cards
		if (state.table_state.length > 0) {
			// render table

			let innerHTML = "";

			for (let i = 0; i < state.table_state.length; i++) {
				if (!state.table_state[i]) {
					continue;
				}
				let currentCard = state.table_state[i];
				if (currentCard.selected) {
					innerHTML += `
                    <div class="col-3 text-center py-3"> 
                    <img src='assets/images/cards/${currentCard.card_id}.png' class='box-shadow border border-danger col-12 pulse animated js-card' data-index=${i}>
                    </div>
                    `;
					// <a class="badge badge-primary p-5 js-card" data-index=${i}>${currentCard.card_id}</a>
				} else {
					innerHTML += `
                    <div class="col-3 text-center border-bottom py-3"> 
                    <img src='assets/images/cards/${currentCard.card_id}.png' class='col-12 js-card' data-index=${i}>
                    </div>
                    `;
				}
				// <span class='font-weight-bold col-12'>${currentCard.color.toUpperCase()}   ${currentCard.shape}</span>
				// <a class="badge badge-secondary p-5 col-12 js-card" data-index=${i}>${currentCard.card_id}</a>
				// <span class='font-weight-bold col-12'>${currentCard.number}   ${currentCard.shading.toUpperCase()}</span>
			}

			table.innerHTML = innerHTML;
		}
	} else {
		info.innerHTML = `
            <h1> Error: 404; Something Broke! </h1>
        `;
	}
};

render(state);

/*
    // ---- To Do ---- // 


    1. FIX end game conditions

    2. Add Tutorial

    3. Add Hints

    4. Have a second checkTable func that loops backwards



*/
