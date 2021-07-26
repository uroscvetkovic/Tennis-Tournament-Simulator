const readlineSync = require("readline-sync");
const playersListJSON = require("./tenis-players.json")

const main = () => {
/*   const N = readlineSync.question("Unesite broj tenisera (N):"); */

  const tennisPlayers = createPlayersArray(8)
  const pairs = createPairs(tennisPlayers)
  console.log(pairs)
};

const createPlayersArray = (N) => {
  return playersListJSON.players.slice(0, N)
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

main();
