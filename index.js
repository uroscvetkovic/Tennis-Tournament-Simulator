//const readlineSync = require("readline-sync");
let playersListJSON = [];

async function onLoad() {
  let response = await fetch('./tenis-players.json')
  playersListJSON = await response.json()
}

function generateTournament() {
  const tennisPlayers = createPlayersArray()
  const pairs = createPairs(tennisPlayers)
  const rounds = simulateTournament(pairs)
  createTournamentTable()
  fillTournamentTable(rounds) 
};

const getPlayersNumber = () => {
  let playersNumber = document.getElementById('playersNumber')
  return playersNumber.options[playersNumber.selectedIndex].value
}

const createPlayersArray = () => {
  return playersListJSON.players.slice(0, getPlayersNumber())
}

const createPairs = (tennisPlayers) => {

  const validatePairs = (twoPairs) => {
    return Math.abs(twoPairs[1].rank - twoPairs[0].rank) > 1 && 
           Math.abs(twoPairs[2].rank - twoPairs[3].rank) > 1
  }

  let shuffledPlayers = tennisPlayers.sort((a, b) => 0.5 - Math.random())
  shuffledPlayers = shuffledPlayers.reduce((acc, _value, index, players) => {
    let temp
    if (index % 4 === 0) {
      temp = players.slice(index, index + 4)
      while (!validatePairs(temp)) {
        temp.sort((a, b) => 0.5 - Math.random())
      }
      acc.push(...temp.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)]))
    }
    return acc
  }, [])
  return shuffledPlayers 
}

const simulateTournament = (pairs) => {
  let rounds = []
  rounds.push(pairs)
  const simulateRound = (roundPairs) => {
    return roundPairs.reduce((acc, pairs) => {
      return acc.concat(pairs[Math.floor(Math.random()*pairs.length)])
    },[])
  }
  for (let index = 0; index < Math.log2(getPlayersNumber()); index++) {
    let round = simulateRound(rounds[index])
    rounds.push([...round.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)])])
  }
  return rounds
}

const createTournamentTable = () => {
  let colNumber = Math.log2(getPlayersNumber())+1
  const table = document.getElementById("tournament-table")
  table.innerHTML = ""
  for (let index = 0; index < colNumber; index++) {
    let col = document.createElement("div")
    col.id = 'col-' + index
    table.appendChild(col)
  }
}

const fillTournamentTable = (rounds) => {
  const table = document.getElementById("tournament-table")
  let columns = table.childNodes
  for (let index = 0; index < columns.length; index++) {
    for (let j = 0; j < rounds[index].length; j++) {

      let player1 = rounds[index][j][0]
      let player2 = rounds[index][j][1]

      const getString = (player) => {
        if (player != undefined) {
          return `
            ${player.firstName[0]}. ${player.lastName}
            (${player.country} ${player.rank})  `
        }   
        return ""
      }

      columns[index].innerHTML += 
      `
        <div class="pair-div">
          <p>${getString(player1)}</p>
          <p>${getString(player2)}</p>
        </div>
      `
      
    }
    
  }
}

onLoad()
//generateTournament()
