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
  if (playersListJSON.players.length < getPlayersNumber()) {
    alert("Not enough players in file");
  }
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
  let score = []
  rounds.push(pairs)
  const simulateRound = (roundPairs) => {
    return roundPairs.reduce((acc, pairs) => {
      let pairWinner = Math.floor(Math.random()*pairs.length)
      score.push(pairWinner > 0 ? [Math.floor(Math.random()*3), 3] : [3, Math.floor(Math.random()*3)])
      return acc.concat(pairs[pairWinner])
    },[])
  }
  for (let index = 0; index < Math.log2(getPlayersNumber()); index++) {
    let round = simulateRound(rounds[index])
    rounds.push([...round.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)])])
  }

  return [rounds, score]
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
    for (let j = 0; j < rounds[0][index].length; j++) {

      let player1 = rounds[0][index][j][0]
      let player2 = rounds[0][index][j][1]
      let score = rounds[1][0] != undefined ? rounds[1].shift() : ""

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
          <div>
            <p>${getString(player1)} </p>
            <p>${getString(player2)} </p>
          </div>
          <div class="score">
            <span>${score[0] != undefined ? score[0]: ""}</span>
            <span>${score[1] != undefined ? score[1]: ""}</span>
          </div>

        </div>
      `
      
    }
    
  }
}

onLoad()
//generateTournament()
