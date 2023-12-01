import ApiService from "../ApiService"

export default class ScheduleTagService {

    scheduleTagUrl = '/schedule-tag'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }


    async getScheduleTags() {
        return await this.apiService.get(
            this.scheduleTagUrl
        )
    }

    async getScheduleTag(id) {
        return await this.apiService.sendRequest(
            this.scheduleTagUrl + "/" + id,
            "GET",
        )
    }

    async addScheduleTag(tag) {
        return await this.apiService.post(
            this.scheduleTagUrl,
            tag
        )
    }

    async editScheduleTag(tag) {
        return await this.apiService.put(
            this.scheduleTagUrl,
            tag
        )
    }

    async deleteScheduleTag(id) {
        return await this.apiService.delete(`${this.scheduleTagUrl}/${id}`)
    }
}
