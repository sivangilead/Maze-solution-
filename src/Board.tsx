import React, { useState } from 'react'

const renderGame = (row: number[]) => {
  const array = []
  for (let j = 0; j < row.length; j++) {
    array.push(
      <div
        key={j}
        style={{
          width: '32px',
          height: '32px',
          backgroundColor:
            row[j] === 0
              ? 'white'
              : row[j] === 1
              ? 'black'
              : row[j] === 2
              ? 'green'
              : 'blue',
        }}
      ></div>
    )
  }
  return array
}

const updateBoard = async (
  path: pathNodes,
  exitKey: number,
  gameMap: Array<Array<number>>
) => {
  let gameArray = []
  let currentKey = exitKey

  gameArray.unshift([
    Math.floor(exitKey / gameMap[0].length),
    exitKey % gameMap[0].length,
  ])
  while (path[currentKey][0] !== 0 || path[currentKey][1] !== 0) {
    currentKey = path[currentKey][0] * gameMap[0].length + path[currentKey][1]
    gameArray.unshift([
      Math.floor(currentKey / gameMap[0].length),
      currentKey % gameMap[0].length,
    ])
  }
  for (let i = 0; i < gameArray.length; i++) {
    let currentSquare = gameArray[i]
    gameMap[currentSquare[0]][currentSquare[1]] = 2
  }
  return gameMap
}

const GameMoves = (
  currentRow: number,
  currentCol: number,
  intialGame: Array<Array<number>>
) => {
  const moves = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ]

  let neighborArray = []
  for (let i = 0; i < moves.length; i++) {
    let move = moves[i]
    let newRow = currentRow + move[0]
    let newCol = currentCol + move[1]

    if (
      newRow >= 0 &&
      newCol >= 0 &&
      newRow < intialGame.length &&
      newCol < intialGame[0].length
    ) {
      if (
        intialGame[newRow][newCol] === 0 ||
        intialGame[newRow][newCol] === 3
      ) {
        neighborArray.push([newRow, newCol])
      }
    }
  }
  return neighborArray
}

type pathNodes =Record<string, any>


interface bfsFunc {
  (
    maze: Array<Array<number>>,
    startNode: Array<number>,
    endNode: Array<number>
  ): pathNodes
}

const bfs: bfsFunc = (
  maze: Array<Array<number>>,
  startNode: Array<number>,
  endNode: Array<number>
) => {
  let queue = [startNode] //tracking nodes to visit
  let visited: Array<Array<number>> = [startNode]
  const prev:pathNodes = {} //prev node in the path
  let current: undefined | Array<number>
  while (queue.length !== 0) {
    current = queue.shift() //at the beginning the start node,[0,0]
    if (current) {
      const neighbors = GameMoves(current[0], current[1], maze)
      const nonVisitedneighbors = neighbors.filter((neighbor) => {
        for (let i = 0; i < visited.length; i++) {
          if (visited[i][0] === neighbor[0] && visited[i][1] === neighbor[1]) {
            return false
          }
        }
        return true
      })
      visited = [...visited, ...nonVisitedneighbors]
      queue = [...queue, ...nonVisitedneighbors]
      nonVisitedneighbors.forEach((neighbor) => {
        const pathKey = (neighbor[0] * maze[0].length + neighbor[1]).toString()
        prev[pathKey] = current
      })
    }
  }
  return prev
}

const Board = () => {
  const intialGame: Array<Array<number>> = [
    [2, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 3],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  ]

  const exitKey = intialGame[0].length - 1

  const [gameMap, setGameMap] = useState(intialGame)

  return (
    <div>
      {gameMap.map((row: Array<number>, idx: number) => {
        return (
          <div key={idx} style={{ display: 'flex' }}>
            {renderGame(row)}
          </div>
        )
      })}
      <button
        onClick={async () => {
          const newGameMap = await updateBoard(
            bfs(intialGame, [0, 0], [0, exitKey]),
            exitKey,
            gameMap
          )
          return await setGameMap([...newGameMap])
        }}
      >
        Start
      </button>
    </div>
  )
}

export default Board
