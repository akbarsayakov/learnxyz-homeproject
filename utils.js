import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from './firebaseConfig'

export const EMPTY_BOARD = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]

export const maybeWinner = (board) => {
  const winConditions = [
    [0, 1, 2], // horizontal top
    [3, 4, 5], // horizontal middle
    [6, 7, 8], // horizontal bottom
    [0, 3, 6], // vertical left
    [1, 4, 7], // vertical center
    [2, 5, 8], // vertical right
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ]
  let gameState = board.flat()

  console.log('GAME STATE: ', gameState)
  for (const condition of winConditions) {
    const [a, b, c] = condition
    console.log('gameState[a]: ', gameState[a])
    if (
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c] &&
      gameState[a]
    ) {
      console.log('RETURN ', gameState[a])
      return gameState[a] // return the winner (X or O)
    }
  }
  return null
}

export const getCurrentTimeZoneWithOffset = () => {
  const date = new Date()
  const timeZoneOffsetInMinutes = date.getTimezoneOffset()

  // Convert the offset to hours and minutes
  const offsetHours = Math.floor(Math.abs(timeZoneOffsetInMinutes) / 60)
  const offsetMinutes = Math.abs(timeZoneOffsetInMinutes) % 60

  // Determine if the offset is positive or negative
  const offsetSign = timeZoneOffsetInMinutes > 0 ? '-' : '+'

  // Format the offset string as 'GMT+HH:MM' or 'GMT-HH:MM'
  const offsetString = `GMT${offsetSign}${String(offsetHours).padStart(
    2,
    '0'
  )}:${String(offsetMinutes).padStart(2, '0')}`

  return offsetString
}

const isLastGamePlayedYesterday = (lastGamePlayed, homeTimeZone) => {
  const currentDate = new Date()
  const lastGameDate = new Date(lastGamePlayed)

  // Adjust the last game date to the user's home timezone
  const homeTimeZoneOffset = parseInt(homeTimeZone.substring(4), 10)
  const lastGameDateInHomeTimeZone = new Date(
    lastGameDate.getTime() + homeTimeZoneOffset * 60 * 1000
  )

  // Check if the last game was played yesterday in the user's current timezone
  return (
    currentDate.getDate() - lastGameDateInHomeTimeZone.getDate() === 1 &&
    currentDate.getMonth() === lastGameDateInHomeTimeZone.getMonth() &&
    currentDate.getFullYear() === lastGameDateInHomeTimeZone.getFullYear()
  )
}

const updateStreakOnGameEnd = (userRef) => {
  getDoc(userRef)
    .then((res) => {
      const {
        homeTimeZone,
        streak: { currentStreak, lastGamePlayed, longestStreak },
      } = res.data()
      const didPlayYesterday = isLastGamePlayedYesterday(
        lastGamePlayed,
        homeTimeZone
      )
      const updatedStreak = {
        currentStreak: didPlayYesterday ? currentStreak + 1 : 1,
        lastGamePlayed: new Date().toISOString(),
        longestStreak:
          currentStreak + 1 > longestStreak ? currentStreak + 1 : longestStreak,
      }
      setDoc(
        userRef,
        {
          streak: updatedStreak,
        },
        { merge: true }
      ).finally(() => {
        return
      })
    })
    .finally(() => {
      return
    })
}

const updateWinLossOnGameEnd = (userRef, didWin, isTied) => {
  getDoc(userRef)
    .then((res) => {
      const { gamesPlayed = 0, gamesWon = 0, gamesTied = 0 } = res.data()
      setDoc(
        userRef,
        {
          gamesPlayed: gamesPlayed + 1,
          gamesWon: didWin && !isTied ? gamesWon + 1 : gamesWon,
          gamesTied: isTied ? gamesTied + 1 : gamesTied,
        },
        { merge: true }
      ).finally(() => {
        return
      })
    })
    .finally(() => {
      return
    })
}

export const updateUserOnGameEnd = async (userId, didWin, isTied) => {
  const userRef = doc(firestore, 'users/', userId)
  await updateStreakOnGameEnd(userRef)
  await updateWinLossOnGameEnd(userRef, didWin, isTied)
}
