import ApiService from "../ApiService";

export default class ScheduleBlockService {

    scheduleBlockUrl = '/schedule-block'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getScheduleBlocksByDay(tagId, day) {
        const params = [
            {
                key: "scheduleTagId",
                value: tagId,
            },
            {
                key: "day",
                value: day,
            }
        ]

        return await this.apiService.sendRequest(
            this.scheduleBlockUrl + "/by-day",
            "GET",
            params
        )
    }

    async addScheduleBlock(block) {
        const jsonBlock = JSON.stringify(block);
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl,
            "POST",
            [],
            jsonBlock,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async editScheduleBlock(block) {
        const jsonBlock = JSON.stringify(block);
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl,
            "PUT",
            [],
            jsonBlock,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async deleteScheduleBlock(blockId) {
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl + "/" + blockId,
            "DELETE",
            [],
        )
    }

    async getParameters(blockId) {
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl + "/" + blockId + "/parameter",
            "GET",
            []
        )
    }

    async assignParameterToScheduleBlock(parameter) {
        const jsonParameter = JSON.stringify(parameter);
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl + '/parameter',
            "PUT",
            [],
            jsonParameter,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async deleteParameterFromScheduleBlock(parameter) {
        return await this.apiService.sendRequest(
            this.scheduleBlockUrl + "/parameter/" + parameter.id ,
            "DELETE",
            [],
        )
    }

}
