var teams = [];
for (var i = 0; i < 8; i++) {
    teams.push('team' + (i + 1));
}

var shuffleArray = function(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function FairForAllDyp(teams) {
    var _self = this;

    _self.rounds = [];
    var spieltage = teams.length - 1;
    var spiele_pro_spieltag = teams.length * spieltage / spieltage / 2;
    var matches = [];

    for (var i = 0; i < teams.length; i++) {
        for (var j = i + 1; j < teams.length; j++) {
            var match = teams[i] + ' vs. ' + teams[j];
            matches.push(match);
        }
    }
    
    console.log(matches.length);
    
    for (var i = 0; i < spieltage; i++) {
        _self.rounds[i] = [];
        for (var j = 0; j < spiele_pro_spieltag; j++) {
            var idx = (j % 2 == 0) ? 0 : matches.length-1;
            _self.rounds[i].push(matches[idx]);
            matches.splice(idx, 1);
        }
    }
    console.log(_self.rounds);
    console.log('Spieltage: ' + spieltage);
    console.log('Spiele pro Spieltag: ' + spiele_pro_spieltag);
}

var turnier = new FairForAllDyp(teams);
