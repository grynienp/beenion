import { PublicationEvent } from 'domain/types/events'
import { canRemoveStageRule } from 'domain/businessRules'
import { PUBLICATION_STAGE_RULES_UPDATE_NOT_ALLOWED } from 'domain/errorCodes'
import reduceToUser from 'domain/reduceToUser'
import reduceToPublication from 'domain/reduceToPublication'
import {
  createUserHistory,
  createPublicationHistory,
  createStage,
  createTimestamp
} from 'domain/typeFactories'

function removeStageRule (command: {
  userHistory: object[]
  publicationHistory: object[]
  stage: number
  timestamp: number
}): PublicationEvent[] {

  const userHistory = createUserHistory(command.userHistory)
  const publicationHistory = createPublicationHistory(command.publicationHistory)
  const stage = createStage(command.stage)
  const timestamp = createTimestamp(command.timestamp)

  const user = reduceToUser(userHistory)
  const publication = reduceToPublication(publicationHistory)

  if (!canRemoveStageRule(user, publication, stage)) {
    throw new Error(PUBLICATION_STAGE_RULES_UPDATE_NOT_ALLOWED)
  }

  return [
    {
      type: 'PublicationStageRuleRemoved',
      publicationId: publication.publicationId,
      stage,
      timestamp
    }
  ]
}

export default removeStageRule