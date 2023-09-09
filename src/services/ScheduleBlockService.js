import ApiService from "./ApiService";

export default class ScheduleBlockService {

    scheduleBlockUrl = '/schedule-block'

    apiService = new ApiService();

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
}