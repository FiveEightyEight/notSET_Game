// ---------- SET Logic ------------->>>

const set = (function() {

// card make up
/*
const card = {
    id, // c s n d  // unique id for each card // 81 total
    img, // image
    color, // (red, purple or green)           rd    pp   gr
    shape, // (oval, squiggle or diamond)      ov    sq   di
    number, // (one, two or three)             n1    n2   n3
    shading, // (solid, striped or outlined)   sd    st   ol
}
*/

// rd    pp   gr
// ov    sq   di
// n1    n2   n3
// sd    st   ol
const allCards = {};

// BUILDERS

const buildAllCards = () => {
    const colors = ['rd', 'pp', 'gr'];
    const shape = ['ov', 'sq', 'di'];
    const number = ['n1', 'n2', 'n3'];
    const shading = ['sd', 'st', 'ol'];
    const cards = [];

    for (let c = 0; c < colors.length; c++) {
        for (let s = 0; s < shape.length; s++) {
            for (let n = 0; n < number.length; n++) {
                for (let d = 0; d < shading.length; d++) {
                    cards.push(`${colors[c]}${shape[s]}${number[n]}${shading[d]}`)
                }
            }
        }
    }

    return cards;
}

const buildCard = (card_id) => {
    const colors = { //['rd', 'pp', 'gr'];
        rd: 'red',
        pp: 'purple',
        gr: 'green',
    }
    const shapes = { // ['ov', 'sq', 'di'];
        ov: 'oval',
        sq: 'square',
        di: 'diamond',
    }
    const numbers = { // ['n1', 'n2', 'n3'];
        n1: 'one',
        n2: 'two',
        n3: 'three',
    }
    const shadings = { // ['sd', 'st', 'ol'];
        sd: 'solid',
        st: 'striped',
        ol: 'outlined',
    }

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
    }
}

// <--- HELPER FUNCTIONS --> //
const shuffle = (array) => {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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
}

const ID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.

    // by https://gist.github.com/gordonbrander
    return Math.random().toString(36).substr(2, 9);
};

const pushToAllDecks = (deck_id, cards) => {
    allDecks[deck_id] = {
        cards
    };
};

const checkFeatures = (c1, c2, c3) => {
    /*
        console.log(`
            checking features
            card 1: ${c1}
            card 2: ${c2}
            card 3: ${c3}
        `);
        */
    if (c1 === c2 && c1 === c3) {
        // console.log(`all the same`);
        return true;
    }
    if (c1 !== c2 && c1 !== c3 && c2 !== c3) {
        // console.log(`all different`);
        return true;
    }

    // console.log(`two the same`);
    return false;

};


// have a function that takes an id and spits out a card 

/* how to track what cards are in deck and NOT produce dups? */

/*      <--- deck builder --->       */

class Deck {
    constructor(deck_id, cards, remaining, discard) {
        this.deck_id = deck_id,
            this.cards = cards,
            this.remaining = remaining,
            this.discard = discard
    }
}
/*
const deck = { // Server Side deck
    deck_id, // unique id for deck, assortment of letters and numbers // api can track what deck to reference 
    cards, // array of cards in deck
    remaining, // number of cards in deck
    discard, // discarded cards

}
const playDeck = { // Player Side Deck
    deck_id, // unique id for deck, assortment of letters and numbers // api can track what deck to reference 
    remaining, // number of cards left to draw
    drawn, // cards currently in play
    discard, // discarded cards

}

*/
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
        }
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
        }
    }

}

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


const checkTable = (table) => {

    if (table.length <= 2) {
        return false;
    };

    for (let i = 0; i < table.length - 2; i++) {
        // first card
        let card1 = table[i];
        for (let j = (i + 1); j < table.length - 1; j++) {
            // second card
            let card2 = table[j];
            for (let k = (i + 2); k < table.length; k++) {
                // third card
                let card3 = table[k];
                if (checkSet(card1, card2, card3)) {
                    return [card1, card2, card3];
                };
            };
        };
    };

    return false;
};

const play = (table, deck, noSet = false) => {

    if (noSet) {
        if (table.length < 15) {
            for (let i = table.length; i < 15; i++) {
                const drawnCard = deck.shift();
                table.push(drawnCard);
            };
        };
        return {
            table,
            deck,
            noSet,
        };

    } else {
        if (table.length < 12) {
            for (let i = table.length; i < 12; i++) {
                const drawnCard = deck.shift();
                table.push(drawnCard);
            };
        };
        return {
            table,
            deck,
            noSet,
        };
    };
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
    drawCard,
    display,
    checkTable,
    play,
}


// rd    pp   gr
// ov    sq   di
// n1    n2   n3
// sd    st   ol

})();











// ----- Global Variables ------------>>
// const set = require('./set.js');
const info = document.querySelector('.js-info');
const table = document.querySelector('.js-table');



// ------------>>          ------------>>
// ------------>>  Storage ------------>>
// ------------>>          ------------>>





// ------------>>       *  *  *        ------------>>
// ------------>>  Functions & Helpers ------------>>
// ------------>>       *  *  *        ------------>>


const startNewGame = () => {

    table.innerHTML = '';
    const newDeck = set.buildDeck(true);

    state.play = true;
    state.deck_id = newDeck.deck_id;
    state.deck = newDeck.cards;
    state.remaining = newDeck.remaining;

    render(state);
};




// ------------>>          ------------>>
// ------------>>  Events  ------------>>
// ------------>>          ------------>>

info.addEventListener('click', e => {

    if (e.target.matches('.js-new-game')) {

        // start new game
        startNewGame();
        
    }

});




// ------------>>          ------------>>
// ------------>>  State   ------------>>
// ------------>>          ------------>>

let state = {

    play: false,
    deck_id: '',
    deck: [],
    table: [],
    sets: [],
    remaining: 0,

};


// ------------>>          ------------>>
// ------------>>  Render  ------------>>
// ------------>>          ------------>>


const render = (state) => {

    if(!state.play) {
        // game hasn't started

        info.innerHTML = `

            <a class="btn btn-danger btn-lg js-new-game" href="#" role="button">New Game</a>

        `;

    } else if (state.play) {

        // game has started
        info.innerHTML = `
        <a class="btn btn-warning btn-lg js-no-set" href="#" role="button">NO SET</a>
        <a class="btn btn-danger btn-lg js-new-game" href="#" role="button">New Game</a>

        <p class='pt-4 h6 font-weight-bold'>Deck ID: ${state.deck_id}</p>
        <p class='h5 font-weight-bold'>Cards Left in Deck: ${state.remaining}</p>
        <p class='pt-4 h6 font-weight-bold'>Sets Made: ${state.sets.length}</p>

        `;




    } else {
        info.innerHTML = `
            <h1> Error: 404; Something Broke! </h1>
        `;
    };
};

