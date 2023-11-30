import AddresseeService from "./services/AddresseeService";
import AuthService from "./services/AuthService";
import ScheduleBlockService from "./services/ScheduleBlockService";
import ScheduleTagService from "./services/ScheduleTagService";
import StagedEventService from "./services/StagedEventService";

export default class Backend {
  getAuthService

  getAddresseeService

  getScheduleBlockService

  getScheduleTagService

  getStagedEventService

  constructor() {
    this.getAuthService = () => new AuthService()
    this.getAddresseeService = (token) => new AddresseeService(token || '')
    this.getScheduleBlockService = (token) => new ScheduleBlockService(token || '')
    this.getScheduleTagService = (token) => new ScheduleTagService(token || '')
    this.getStagedEventService = (token) => new StagedEventService(token || '')
  }
}
