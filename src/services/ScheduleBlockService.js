export default class ScheduleBlockService {
    backendUrl = 'http://localhost:8080';

    async getScheduleBlocksByDay(tagId, day) {
        const params = {
            scheduleTagId: tagId,
            day: day
        }

        try {
            return await fetch(
                this.backendUrl + '/schedule-block/by-day?scheduleTagId=' + params.scheduleTagId + '&day=' + params.day,
                {
                    method: 'GET',
                }
            );
        } catch (error) {
            console.error('Error:', error);
        }
    }
}