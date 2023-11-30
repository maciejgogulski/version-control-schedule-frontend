import ApiService from "../ApiService"

export default class ScheduleTagService {

    scheduleTagUrl = '/schedule-tag'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }


    async getScheduleTags() {
        return await this.apiService.sendRequest(
            this.scheduleTagUrl,
            "GET",
        )
    }

    async getScheduleTag(id) {
        return await this.apiService.sendRequest(
            this.scheduleTagUrl + "/" + id,
            "GET",
        )
    }

    async addScheduleTag(tag) {
        const jsonTag = JSON.stringify(tag)
        return await this.apiService.sendRequest(
            this.scheduleTagUrl,
            "POST",
            [],
            jsonTag,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async editScheduleTag(tag) {
        const jsonTag = JSON.stringify(tag)
        return await this.apiService.sendRequest(
            this.scheduleTagUrl,
            "PUT",
            [],
            jsonTag,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async deleteScheduleTag(id) {
        return await this.apiService.sendRequest(
            this.scheduleTagUrl + "/" + id,
            "DELETE",
        )
    }
}
