import { JournalEvent } from 'domain/types/events'
import { canUpdateRankCalcParams } from 'domain/businessRules'
import { JOURNAL_RANKCALCPARAMS_UPDATE_NOT_ALLOWED } from 'domain/errorCodes'
import reduceToUser from 'domain/reduceToUser'
import reduceToJournal from 'domain/reduceToJournal'
import {
  createUserHistory,
  createJournalHistory,
  createRankRange,
  createRankGroup,
  createTimestamp
} from 'domain/typeFactories'

function defineRankCalcGroup (command: {
  userHistory: object[]
  journalHistory: object[]
  rankRange: object
  group: string
  timestamp: number
}): JournalEvent[] {

  const userHistory = createUserHistory(command.userHistory)
  const journalHistory = createJournalHistory(command.journalHistory)
  const rankRange = createRankRange(command.rankRange)
  const group = createRankGroup(command.group)
  const timestamp = createTimestamp(command.timestamp)

  const user = reduceToUser(userHistory)
  const journal = reduceToJournal(journalHistory)

  if (!canUpdateRankCalcParams(user, journal)) {
    throw new Error(JOURNAL_RANKCALCPARAMS_UPDATE_NOT_ALLOWED)
  }

  return [
    {
      type: 'JournalRankCalcGroupDefined',
      journalId: journal.journalId,
      group,
      rankRange,
      timestamp
    }
  ]
}

export default defineRankCalcGroup