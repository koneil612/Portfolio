function Card(point, suit) {
    // getting ready to have the dealer card down.
    var faceDown = false;

    // this is getting the suit and point of the cards 11 = jack so we did a swich and case here to read them for the photos
    function getCardImageUrl() {
        var p = point;
        switch (point) {
            case 11:
                p = 'jack';
                break;
            case 12:
                p = 'queen';
                break;
            case 13:
                p = 'king';
                break;
            case 1:
                p = 'ace';
        }
        // if (faceDown) {
        //     var img = 'static/img/back.jpg';
        //     // $('.back').css('visibility', 'visible');
        //     // $('.front').css('visibility', 'invisible');
        //     return img;
        //
        // } else {
        // }
        return '../static/bjimg/' + p + '_of_' + suit + '.png';
    }

    // getting the point value on the cards geting the ace as 11 also setting the face cards to the 10 point value
    function getValue() {
        if (point > 10) {
            return 10;
        } else if (isAce()) {
            return 11;
        } else {
            return point;
        }
    }

    // this is facedown (dealer first card function)
    function setFaceDown() {
        faceDown = true;
        return this;
    }
    // saying if it's ace put point to 1 we do this later if the hand if over 21
    function isAce() {
        return point == 1;
    }

    // saying if it's ace put point to 1 we do this later if the hand if over 21
    function isFaceDown() {
        return faceDown;
    }
    return {
        "getCardImageUrl": getCardImageUrl,
        "getValue": getValue,
        "isAce": isAce,
        "setFaceDown": setFaceDown,
        "isFaceDown": isFaceDown
    };
}

function Deck() {
    // building the deck
    var deck = [];
    var suits = ['spades', 'diamonds', 'hearts', 'clubs'];
    for (var i = 1; i <= 13; i++) {
        for (var j = 0; j <= 3; j++) {
            deck.push(Card(i, suits[j]));
        }
    }

    var currentIndex = deck.length;

    function shuffle() {
        while (currentIndex !== 0) {
            var randomIndex = Math.floor(Math.random() * deck.length);
            currentIndex -= 1;
            var tempValue = deck[currentIndex];
            deck[currentIndex] = deck[randomIndex];
            deck[randomIndex] = tempValue;
        }
    }
    shuffle();

    function numCardsLeft() {
        return deck.length;
    }

    function draw() {
        return deck.pop();
    }
    return {
        "draw": draw,
        "numCardsLeft": numCardsLeft
    };
}

function Hand(player) {
    var cards = [];
    var numAces = 0;


    function addCard(card) {
        if (card.isAce()) {
            numAces++;
        }
        cards.push(card);
        if (card.isFaceDown()) {
            $("#card-front").append("<img src='static/bjimg/hat.jpg' />");
            $("#card-back").append("<img src='" + card.getCardImageUrl() + "' />");
        } else {
            if(player=="dealer"){
                $("#" + player + "-hand-faceup").append("<img src='" + card.getCardImageUrl() + "' />");
            } else {
                $("#" + player + "-hand").append("<img src='" + card.getCardImageUrl() + "' />");
            }
        }
        $("#" + player + "-points").text(getPoints());
    }


    function getPoints() {
        var sum = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            sum += card.getValue();
        }
        //if I'm over 21 and i have aces:
        aceIndex = 1;
        while (aceIndex <= numAces) {
            if (sum > 21) {
                sum = sum - 10;
            }
            aceIndex++;
        }
        return sum;

    }

    return {
        "addCard": addCard,
        "getPoints": getPoints
    };

}


function PlayGame() {
    var myDeck = Deck();
    var playerHand = Hand("player");
    var dealerHand = Hand("dealer");
    faceDown = false;
    $('#dealer-hand-faceup').empty();
    $('#card-front').empty();
    $('#card-back').empty();
    $('#player-hand').empty();
    $('#player-points').text("");
    $('#dealer-points').text("");



    function deal() {
        playerHand.addCard(myDeck.draw());

        dealerHand.addCard((myDeck.draw()).setFaceDown());
        playerHand.addCard(myDeck.draw());
        if (playerHand.getPoints() == 21) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("Blackjack! Player Wins");

            gameOver();
        }
        dealerHand.addCard(myDeck.draw());
        if (dealerHand.getPoints() == 21) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("Blackjack! The Queen Wins");
            gameOver();
        }
        $("#f1_card").css("transform", "");
        $("#f1_card").css("transition","0.0001s");
        dealerPoints = dealerHand.getPoints();
        playerPoints = playerHand.getPoints();
        $('#player-points').text("");
        $('#dealer-points').text("");
        $('#dealer-points').append(dealerPoints);
        $('#player-points').append(playerPoints);
        $("#deal-button").prop("disabled", true);
        $("#hit-button").prop("disabled", false);
        $("#stand-button").prop("disabled", false);
        $('#dealer-points').css('visibility', 'hidden');

    }

    function hit() {
        playerHand.addCard(myDeck.draw());
        if (playerHand.getPoints() > 21) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("Player busts!");
            gameOver();
        }
    }

    function stand() {
        $("#hit-button").prop("disabled", true);
        $("#stand-button").prop("disabled", true);

        while (dealerHand.getPoints() < 17) {
            dealerHand.addCard(myDeck.draw());
        }
        if (dealerHand.getPoints() > 21) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("The Queen busts! You Win!" + playerPoints);
        } else if (dealerHand.getPoints() > playerHand.getPoints()) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("The Queen wins!");
        } else if (dealerHand.getPoints() == playerHand.getPoints()) {
            $('#dealer-points').css('visibility', 'visible');
            $("#player-points").text("Push!");
        } else {
            $("#player-points").text("Player Wins!");
        }
        gameOver();
    }

    function bet() {
        // var betting = $("#betting").html();
        // var money = $("#player-bank").html();
        // var winnings = bet * 2;
        // $("#bet-increase").html('0');
        // $("#money").html(parseInt(winnings) + parseInt(money));
        //     return false;
        var count = 1000;
        var counter = 10;
        if ($("#increase-button").click)(function() {
        count = count - 10;
         $("#player-bank").html("$"+count);
         $('#counter').html(function(i, val) { return val*1+10 });
        });
        if ($("#decrease-button").click)(function() {
         count = count + 10;
         $("#player-bank").html("$"+count);
         $('#counter').html(function(i, val) { return val*1-10 });
        });
    }



    function gameOver() {
        $("#hit-button").prop("disabled", true);
        $("#stand-button").prop("disabled", true);
        $("#deal-button").prop("disabled", false);
        $("#f1_card").css("transform", "rotateY(180deg)");
        $("#f1_card").css("transition","1.0s");
    }

    return {
        "hit": hit, "stand": stand, "deal": deal, "bet": bet, "gameOver": gameOver};
}


$("document").ready(function() {
    var game;
    // var count = 1000;
    // var counter = 10;
    $("#hit-button").prop("disabled", true);
    $("#stand-button").prop("disabled", true);

    // deal-button
    $('#deal-button').click(function() {
        $("#decrease-button").prop("disabled", true);
        $("#increase-button").prop("disabled", true);
        game = PlayGame();
        game.deal();

    });
    // hit-button
    $('#hit-button').click(function() {
        game.hit();
    });
    // stand-button
    $('#stand-button').click(function() {
        $('#dealer-points').css('visibility', 'visible');
        $("#f1_card").css("transform", "rotateY(180deg)");
        $("#f1_card").css("transition","1.0s");
        $("#f1_card").css("-5px 5px 5px #aaa");
        game.stand();
    });

    $("#increase-button").click(function() {
        game.bet();
//     count = count - 10;
//     $("#player-bank").html("$"+count);
//      $('#counter').html(function(i, val) { return val*1+10 });
// });

    // $("#decrease-button").click(function() {
    //     count = count + 10;
    //     $("#player-bank").html("$"+count);
    //      $('#counter').html(function(i, val) { return val*1-10 });
    //     });

    //     var startingBank = $('#player-bank');
    //     var increase = $()
    //     $('#bet-increase').text("$" )
    //     $('#player-bank').text($('#player-bank').val() + 10);
    });
});
