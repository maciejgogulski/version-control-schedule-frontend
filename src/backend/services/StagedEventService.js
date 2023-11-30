import ApiService from "../ApiService";

export default class StagedEventService {

    url = '/staged-event'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getModificationsForStagedEvent(stagedEventId) {
        return await this.apiService.sendRequest(
            this.url + "/" + stagedEventId + "/modification",
            "GET",
            []
        )
    }

    async getLatestStagedEventForSchedule(scheduleTagId) {
        return await this.apiService.sendRequest(
            this.url + "/schedule-tag/" + scheduleTagId + "/latest",
            "GET",
            []
        )
    }

    async commitStagedEvent(stagedEventId) {
        return await this.apiService.sendRequest(
            this.url + "/" + stagedEventId + "/commit",
            "PUT",
            []
        )
    }
}
