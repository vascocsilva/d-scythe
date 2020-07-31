import React, { useContext } from 'react'
import PlayersContext from './contexts/players.context'
import ExtensionContext from './contexts/extension.context'
import { BASE_FACTIONS, ALL_FACTIONS } from './constants/factions'
import { BASE_BOARDS, ALL_BOARDS } from './constants/boards'
import bannedCombinations from './constants/banned'
import styled from 'styled-components'

const Results = ({
    isActive,
    previousStep,
  }) => {
  const { players } = useContext(PlayersContext)
  const { extension } = useContext(ExtensionContext)

  const isBannedCombo = (faction, board) => {
    const factions = extension ? ALL_FACTIONS : BASE_FACTIONS
    const boards = extension ? ALL_BOARDS : BASE_BOARDS

    return (
      factions[bannedCombinations[0][0]].name === faction
      && boards[bannedCombinations[0][1]] === board
      ) || (
        factions[bannedCombinations[1][0]].name === faction &&
        boards[bannedCombinations[1][1]] === board
      )
  }

  const computeResults = () => {
    const factions = extension ?  [...ALL_FACTIONS] : [...BASE_FACTIONS]
    const boards = extension ? [...ALL_BOARDS] : [...BASE_BOARDS]

    let player = 1
    let results = []
    let factionsIndex
    let boardsIndex

    do {
      do {
        factionsIndex = Math.floor(Math.random() * factions.length)
        boardsIndex = Math.floor(Math.random() * boards.length)
      } while (isBannedCombo(factions[factionsIndex].name, boards[boardsIndex]))


      results.push([
        Object.assign({}, factions[factionsIndex]),
        boards[boardsIndex],
      ]);

      factions.splice(factionsIndex, 1)
      boards.splice(boardsIndex, 1)

      player+=1
    } while(player <= players)

    return results.map((combo, index) => { return (
      <PlayerCard
        key={combo[0].name}
        style={{
          border: `1px solid #fff`,
          boxShadow: `inset 0px 0px 11px -1px #fff`
        }}
      >
        <img
          alt={combo[0].name}
          src={`images/${combo[0].image}`}
          style={{ borderColor: `${combo[0].color}` }}
        />
        <div className="info">
          <p><b>Player {index + 1} - { combo[0].name }</b></p>
          <p><b>{ combo[1] }</b></p>
          <p className="character">{ combo[0].character }</p>
        </div>
      </PlayerCard>
    )})
  }

  return (
    <ResultsStyled>
      <h1>Results</h1>
      <div style={{ width: '95%', maxWidth: '800px' }}>
        { isActive && computeResults() }
      </div>
      <a href="#" onClick={previousStep} style={{ marginTop: '20px' }}>Redo</a>
    </ResultsStyled>
  )
}

const ResultsStyled = styled.div `
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 50px;
`

const PlayerCard = styled.div `
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0px 6px 10px 3px rgba(0,0,0,0.35);
  display: flex;
  margin-top: 20px;
  padding: 2.5vw 8vw 2.5vw 4vw;
  position: relative;
  align-items: center;

  img {
    flex-basis: calc(50px + 10vw);
    height: calc(50px + 10vw);
    border-radius: 50%;
    border: 5px solid;
  }

  .info {
    margin-left: 5vw;
    text-align: left;

    p {
      font-size: calc(14px + 1vw);
      margin: 5px 0;

      b {
        color: #bb3e1a;
        text-transform: uppercase;
      }

      &.character {
        opacity: 0.8;
      }
    }
  }

  .color {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    position: absolute;
    right: 20px;
    top: 20px;
  }
`

Results.displayName = 'Results'

export default Results