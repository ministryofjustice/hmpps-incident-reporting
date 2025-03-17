import QuestionsToDelete from './questionsToDelete'
import ASSAULT from '../reportConfiguration/types/ASSAULT'
import KEY_LOCK_INCIDENT from '../reportConfiguration/types/KEY_LOCK_INCIDENT'
import OLD_ASSAULT from '../reportConfiguration/types/OLD_ASSAULT'
import OLD_DRONE_SIGHTING from '../reportConfiguration/types/OLD_DRONE_SIGHTING'

describe('QuestionToDelete service', () => {
  describe('linear path, nothing to delete', () => {
    it('returns an empty array when path is incomplete but valid', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/ASSAULT.svg
      const config = ASSAULT
      const answeredQuestions = [
        // 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT'
        { code: '61279', responses: [{ response: 'IEP REGRESSION' }] },
        // 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES'
        { code: '61280', responses: [{ response: 'NO' }] },
        // 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT'
        { code: '61281', responses: [{ response: 'YES' }] },
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        { code: '61282', responses: [{ response: 'YES' }] },
        // 'IS THE LOCATION OF THE INCDENT KNOWN'
        { code: '61283', responses: [{ response: 'YES' }] },
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual([])
    })

    it('returns an empty array when valid path reaches the end', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/ASSAULT.svg
      const config = ASSAULT
      const answeredQuestions = [
        // WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT
        { code: '61279', responses: [{ response: 'IEP REGRESSION' }] },
        // IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES
        { code: '61280', responses: [{ response: 'NO' }] },
        // IS THERE ANY MEDIA INTEREST IN THIS INCIDENT
        { code: '61281', responses: [{ response: 'YES' }] },
        // HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED
        { code: '61282', responses: [{ response: 'YES' }] },
        // IS THE LOCATION OF THE INCDENT KNOWN
        { code: '61283', responses: [{ response: 'NO' }] },
        // WAS THIS A SEXUAL ASSAULT
        { code: '61285', responses: [{ response: 'NO' }] },
        // DID THE ASSAULT OCCUR DURING A FIGHT
        { code: '61286', responses: [{ response: 'NO' }] },
        // WHAT TYPE OF ASSAULT WAS IT
        { code: '61287', responses: [{ response: 'OTHER' }] },
        // WERE ANY STAFF ASSAULTED
        { code: '61288', responses: [{ response: 'NO' }] },
        // WAS SPITTING USED IN THIS INCIDENT
        { code: '61290', responses: [{ response: 'NO' }] },
        // WERE ANY WEAPONS USED
        { code: '61294', responses: [{ response: 'NO' }] },
        // WERE ANY INJURIES RECEIVED DURING THIS INCIDENT
        { code: '61296', responses: [{ response: 'NO' }] },
        // ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT
        { code: '61306', responses: [{ response: 'NO' }] },
        // ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT
        { code: '61307', responses: [{ response: 'NO' }] },
        // DID THE ASSAULT OCCUR IN PUBLIC VIEW
        { code: '61308', responses: [{ response: 'NO' }] },
        // IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT
        { code: '61309', responses: [{ response: 'NO' }] },
        // WAS THERE AN APPARENT REASON FOR THE ASSAULT
        { code: '61311', responses: [{ response: 'NO' }] },
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual([])
    })
  })

  describe('avoid branching, future question retained', () => {
    it('returns only question in branch', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/ASSAULT.svg
      const config = ASSAULT
      const answeredQuestions = [
        // 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT'
        { code: '61279', responses: [{ response: 'IEP REGRESSION' }] },
        // 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES'
        { code: '61280', responses: [{ response: 'NO' }] },
        // 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT'
        { code: '61281', responses: [{ response: 'YES' }] },
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        { code: '61282', responses: [{ response: 'YES' }] },
        // 'IS THE LOCATION OF THE INCDENT KNOWN'
        { code: '61283', responses: [{ response: 'NO' }] }, // Changed to 'NO'

        // 'WHAT WAS THE LOCATION OF THE INCIDENT'
        { code: '61284', responses: [{ response: 'GYM' }] }, // This is deleted

        // 'WAS THIS A SEXUAL ASSAULT'
        { code: '61285', responses: [{ response: 'NO' }] }, // After branch / retained
        // 'DID THE ASSAULT OCCUR DURING A FIGHT'
        { code: '61286', responses: [{ response: 'NO' }] }, // Retained
        // 'WHAT TYPE OF ASSAULT WAS IT'
        { code: '61287', responses: [{ response: 'PRISONER ON PRISONER' }] }, // Retained
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['61284'])
    })
  })

  describe('nested branching, some future questions deleted', () => {
    it('returns question after branch', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/OLD_ASSAULT.svg
      const config = OLD_ASSAULT
      const answeredQuestions = [
        // 'WERE THE POLICE INFORMED OF THE INCIDENT'
        { code: '44127', responses: [{ response: 'YES (ENTER DATE)' }] }, // Changed to 'YES (ENTER DATE)'

        // Questions in branch not answered yet

        // 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION'
        { code: '44405', responses: [{ response: 'YES' }] }, // After branch / deleted
        // "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION"
        { code: '45088', responses: [{ response: 'NO' }] }, // Deleted
      ]

      // NOTE: '44405'/'45088' are deleted because there is a nested branch before them
      // and we don't know yet the answer to '44913'/'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION'
      // which branches as well

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['44405', '45088'])
    })
  })

  describe('nested branching, branch questions deleted, future questions retained', () => {
    it('returns only question in branch', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/OLD_ASSAULT.svg
      const config = OLD_ASSAULT
      const answeredQuestions = [
        // 'WERE THE POLICE INFORMED OF THE INCIDENT'
        { code: '44127', responses: [{ response: 'NO' }] }, // Changed to 'NO'

        // 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION'
        { code: '44913', responses: [{ response: 'YES' }] }, // In branch / deleted
        // 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING'
        { code: '45092', responses: [{ response: 'NO' }] }, // In branch / delete

        // 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION'
        { code: '44405', responses: [{ response: 'YES' }] }, // After branch / retained
        // "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION"
        { code: '45088', responses: [{ response: 'NO' }] }, // Retained
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['44913', '45092'])
    })
  })

  describe('subsequent branching, only branch questions deleted', () => {
    it('returns only question in 2nd main branch', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/OLD_ASSAULT.svg
      const config = OLD_ASSAULT
      const answeredQuestions = [
        // 'WERE THE POLICE INFORMED OF THE INCIDENT'
        { code: '44127', responses: [{ response: 'YES (ENTER DATE)' }] },

        // 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION'
        { code: '44913', responses: [{ response: 'NO' }] }, // In 1st branch / retained

        // 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION'
        { code: '44405', responses: [{ response: 'YES' }] }, // After 1st branch / retained
        // "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION"
        { code: '45088', responses: [{ response: 'NO' }] },
        // 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES'
        { code: '44880', responses: [{ response: 'NO' }] },
        // 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT'
        { code: '44153', responses: [{ response: 'NO' }] },
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        { code: '44186', responses: [{ response: 'NO' }] },
        // 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED'
        { code: '44201', responses: [{ response: 'NO' }] }, // Changed to 'NO'

        // 'WHAT WAS THE LOCATION OF THE INCIDENT'
        { code: '45134', responses: [{ response: 'GYM' }] }, // In 2nd branch / delete

        // 'WAS THIS A SEXUAL ASSAULT'
        { code: '44586', responses: [{ response: 'NO' }] }, // After 2nd branch / retained
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['45134'])
    })
  })

  describe('linear path with erroneous values', () => {
    it('returns problematic question and subsequent ones', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/ASSAULT.svg
      const config = ASSAULT
      const answeredQuestions = [
        // WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT
        { code: '61279', responses: [{ response: 'IEP REGRESSION' }] },
        // IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES
        { code: '61280', responses: [{ response: 'NO' }] },
        // IS THERE ANY MEDIA INTEREST IN THIS INCIDENT
        { code: '61281', responses: [{ response: 'YES' }] },
        // HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED
        { code: '61282', responses: [{ response: 'YES' }] },
        // IS THE LOCATION OF THE INCDENT KNOWN
        { code: '61283', responses: [{ response: 'NO' }] },
        // WAS THIS A SEXUAL ASSAULT
        { code: '61285', responses: [{ response: 'NO' }] },
        // DID THE ASSAULT OCCUR DURING A FIGHT
        { code: '61286', responses: [{ response: 'NO' }] },
        // WHAT TYPE OF ASSAULT WAS IT
        { code: '61287', responses: [{ response: 'OTHER' }] },
        // WERE ANY STAFF ASSAULTED
        { code: '61288', responses: [{ response: 'NO' }] },
        // WAS SPITTING USED IN THIS INCIDENT
        { code: '61290', responses: [{ response: 'NO' }] },
        // WERE ANY WEAPONS USED
        { code: '61294', responses: [{ response: 'NO' }] },
        // WERE ANY INJURIES RECEIVED DURING THIS INCIDENT
        { code: '61296', responses: [{ response: 'NO' }] },
        // ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT
        { code: '61306', responses: [{ response: 'NO' }] },
        // ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT
        { code: '61307', responses: [{ response: 'NO' }] },
        // DID THE ASSAULT OCCUR IN PUBLIC VIEW
        { code: '61308', responses: [{ response: 'NO' }] },
        // IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT
        { code: '61309', responses: [{ response: 'ERROR' }] }, // not a valid response
        // WAS THERE AN APPARENT REASON FOR THE ASSAULT
        { code: '61311', responses: [{ response: 'NO' }] }, // would be valid but comes after an invalid one
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['61309', '61311'])
    })
  })

  describe('retains only active configs', () => {
    let oldSetting: boolean

    beforeAll(() => {
      oldSetting = OLD_DRONE_SIGHTING.questions['57179'].active
      OLD_DRONE_SIGHTING.questions['57179'].active = true
    })

    afterAll(() => {
      OLD_DRONE_SIGHTING.questions['57179'].active = oldSetting
    })

    it('returning only questions whose response configs are genuinely inactive', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/KEY_LOCK_INCIDENT.svg
      // key lock incident has numerous inactive AND active responses with the same code for a given question
      const config = KEY_LOCK_INCIDENT
      const answeredQuestions = [
        // Describe the nature of the Incident
        { code: '45196', responses: [{ response: 'Keys lost' }] },
        // Describe the type of key or lock
        { code: '45197', responses: [{ response: 'Magnetic Lock' }] },
        // Incident Level: 1-5. 1 High Risk, 5 No Risk
        { code: '45198', responses: [{ response: 'Enter Value:' }] },
        // Has any remedial action been taken?
        { code: '45199', responses: [{ response: 'No' }] },
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      // if inactive response configs are not filtered out, all question codes would have been deleted
      expect(questionsToDelete).toEqual([])
    })

    it('returning only questions whose configs are genuinely inactive', () => {
      // https://raw.githubusercontent.com/ministryofjustice/hmpps-incident-reporting/main/server/reportConfiguration/types/OLD_DRONE_SIGHTING.svg
      // all question configs are inactive, but pretending that chosen response is active
      const config = OLD_DRONE_SIGHTING
      const answeredQuestions = [
        // Was a drone sighted in mid-flight
        { code: '57179', responses: [{ response: 'Yes' }] },
      ]

      const questionsToDelete = QuestionsToDelete.forGivenAnswers(config, answeredQuestions)
      expect(questionsToDelete).toEqual(['57179'])
    })
  })
})
