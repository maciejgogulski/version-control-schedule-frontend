import ApiService from "./ApiService"

export default class AddresseeService{

    addresseeUrl = '/addressee'

    apiService = new ApiService()

    async getAddressees() {
        return await this.apiService.sendRequest(
            this.addresseeUrl,
            "GET",
        )
    }

    async addressee(id) {
        return await this.apiService.sendRequest(
            this.addresseeUrl + "/" + id,
            "GET",
        )
    }

    async addAddressee(addressee) {
        const jsonAddressee = JSON.stringify(addressee)
        return await this.apiService.sendRequest(
            this.addresseeUrl,
            "POST",
            [],
            jsonAddressee,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async editAddressee(addressee) {
        const jsonAddressee = JSON.stringify(addressee)
        return await this.apiService.sendRequest(
            this.addresseeUrl,
            "PUT",
            [],
            jsonAddressee,
            {
                'Content-Type': 'application/json',
            }
        )
    }

    async deleteAddressee(id) {
        return await this.apiService.sendRequest(
            this.addresseeUrl + "/" + id,
            "DELETE",
        )
    }

    async getAddresseesForScheduleTagId(id) {
        return await this.apiService.sendRequest(
            this.addresseeUrl + '/schedule-tag/' + id,
            "GET",
        )
    }

    async assignAddresseeToScheduleTag(addresseeId, scheduleTagId) {
        return await this.apiService.sendRequest(
            this.addresseeUrl + '/' + addresseeId + '/schedule-tag/' + scheduleTagId,
            "PUT",
        )
    }
}
