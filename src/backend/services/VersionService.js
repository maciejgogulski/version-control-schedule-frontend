import ApiService from "../ApiService";

export default class VersionService {

    url = '/version'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getModificationsForVersion(versionId) {
        return await this.apiService.get(`${this.url}/${versionId}/modification`)
    }

    async getLatestVersionForSchedule(scheduleId) {
        return await this.apiService.get(`${this.url}/schedule/${scheduleId}/latest`)
    }

    async commitVersion(versionId) {
        return await this.apiService.put(`${this.url}/${versionId}/commit`)
    }
}
