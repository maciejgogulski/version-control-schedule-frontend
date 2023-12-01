import ApiService from "../ApiService"

export default class AddresseeService {

    addresseeUrl = '/addressee'

    apiService

    constructor(token) {
        this.apiService = new ApiService(token)
    }

    async getAddressees() {
        return await this.apiService.get(this.addresseeUrl)
    }

    async getAddressee(id) {
        return await this.apiService.get(`${this.addresseeUrl}/${id}`)
    }

    async addAddressee(addressee) {
        return await this.apiService.post(
            this.addresseeUrl,
            addressee,
        )
    }

    async editAddressee(addressee) {
        return await this.apiService.put(
            this.addresseeUrl,
            addressee,
        )
    }

    async deleteAddressee(id) {
        return await this.apiService.delete(`${this.addresseeUrl}/${id}`)
    }

    async getAddresseesForScheduleTagId(id) {
        return await this.apiService.get(`${this.addresseeUrl}/schedule-tag/${id}`)
    }

    async assignAddresseeToScheduleTag(addresseeId, scheduleTagId) {
        return await this.apiService.put(`${this.addresseeUrl}/${addresseeId}/schedule-tag/${scheduleTagId}`)
    }
}
