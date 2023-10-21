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
}