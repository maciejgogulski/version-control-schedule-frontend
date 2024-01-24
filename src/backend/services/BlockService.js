import ApiService from "../ApiService";

export default class BlockService {

    blockUrl = '/block'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getBlocksByDay(scheduleId, day) {
        const params = {
            scheduleId: scheduleId,
            day: day
        }

        return await this.apiService.get(
            `${this.blockUrl}/by-day`,
            params
        )
    }

    async addBlock(block) {
        return await this.apiService.post(
            this.blockUrl,
            block,
        )
    }

    async addMultipleBlocks(blocks) {
        return await this.apiService.post(
            `${this.blockUrl}/multiple`,
            blocks,
        )
    }

    async editBlock(block) {
        return await this.apiService.put(
            this.blockUrl,
            block
        )
    }

    async deleteBlock(blockId) {
        return await this.apiService.delete(`${this.blockUrl}/${blockId}`)
    }

    async getParameters(blockId) {
        return await this.apiService.get(`${this.blockUrl}/${blockId}/parameter`)
    }

    async assignParameterToBlock(parameter) {
        return await this.apiService.put(
            `${this.blockUrl}/parameter`,
            parameter
        )
    }

    async deleteParameterFromBlock(parameter) {
        return await this.apiService.delete(`${this.blockUrl}/parameter/${parameter.id}`)
    }

    async getRelatedBlocks(blockId) {
        return await this.apiService.get(`${this.blockUrl}/${blockId}/related`)
    }

}
