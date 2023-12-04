import AddresseeService from "./services/AddresseeService";
import AuthService from "./services/AuthService";
import BlockService from "./services/BlockService";
import ScheduleService from "./services/ScheduleService";
import VersionService from "./services/VersionService";

export default class Backend {
  getAuthService

  getAddresseeService

  getBlockService

  getScheduleService

  getVersionService

  constructor() {
    this.getAuthService = () => new AuthService()
    this.getAddresseeService = (token) => new AddresseeService(token || '')
    this.getBlockService = (token) => new BlockService(token || '')
    this.getScheduleService = (token) => new ScheduleService(token || '')
    this.getVersionService = (token) => new VersionService(token || '')
  }
}
