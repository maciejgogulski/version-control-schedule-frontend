import ApiService from "./ApiService";

export default class StagedEventService {

    url = '/staged-event'

    apiService = new ApiService();

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
}