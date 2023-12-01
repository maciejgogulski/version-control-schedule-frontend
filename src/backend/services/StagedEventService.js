import ApiService from "../ApiService";

export default class StagedEventService {

    url = '/staged-event'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getModificationsForStagedEvent(stagedEventId) {
        return await this.apiService.get(`${this.url}/${stagedEventId}/modification`)
    }

    async getLatestStagedEventForSchedule(scheduleTagId) {
        return await this.apiService.get(`${this.url}/schedule-tag/${scheduleTagId}/latest`)
    }

    async commitStagedEvent(stagedEventId) {
        return await this.apiService.put(`${this.url}/${stagedEventId}/commit`)
    }
}
