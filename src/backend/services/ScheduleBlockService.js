import ApiService from "../ApiService";

export default class ScheduleBlockService {

    scheduleBlockUrl = '/schedule-block'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getScheduleBlocksByDay(tagId, day) {
        const params = {
            scheduleTagId: tagId,
            day: day
        }

        return await this.apiService.get(
            `${this.scheduleBlockUrl}/by-day`,
            params
        )
    }

    async addScheduleBlock(block) {
        return await this.apiService.post(
            this.scheduleBlockUrl,
            block,
        )
    }

    async editScheduleBlock(block) {
        return await this.apiService.put(
            this.scheduleBlockUrl,
            block
        )
    }

    async deleteScheduleBlock(blockId) {
        return await this.apiService.delete(`${this.scheduleBlockUrl}/${blockId}`)
    }

    async getParameters(blockId) {
        return await this.apiService.get(`${this.scheduleBlockUrl}/${blockId}/parameter`)
    }

    async assignParameterToScheduleBlock(parameter) {
        return await this.apiService.put(
            `${this.scheduleBlockUrl}/parameter`,
            parameter
        )
    }

    async deleteParameterFromScheduleBlock(parameter) {
        return await this.apiService.delete(`${this.scheduleBlockUrl}/parameter/${parameter.id}`)
    }

}
