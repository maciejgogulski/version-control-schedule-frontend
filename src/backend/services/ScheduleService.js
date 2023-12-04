import ApiService from "../ApiService"

export default class ScheduleService {

    scheduleUrl = '/schedule'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }


    async getSchedules() {
        return await this.apiService.get(
            this.scheduleUrl
        )
    }

    async getSchedule(id) {
        return await this.apiService.get(`${this.scheduleUrl}/${id}`)
    }

    async addSchedule(schedule) {
        return await this.apiService.post(
            this.scheduleUrl,
            schedule
        )
    }

    async editSchedule(schedule) {
        return await this.apiService.put(
            this.scheduleUrl,
            schedule
        )
    }

    async deleteSchedule(id) {
        return await this.apiService.delete(`${this.scheduleUrl}/${id}`)
    }
}
