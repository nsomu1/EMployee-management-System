import axios from 'axios';

const SCHEDULE_API_BASE_URL = "http://localhost:8080/api/v1/schedules";
const COURSE_API_BASE_URL1 = "http://localhost:8080/api/v1/schedules/courseIds";

class ScheduleService {

    static instance = new ScheduleService();
    static getInstance() {
        return this.instance;
    }

    getSchedules(){
        return axios.get(SCHEDULE_API_BASE_URL);
    }

    createSchedule(schedule){
        return axios.post(SCHEDULE_API_BASE_URL, schedule);
    }

    getScheduleById(scheduleId){
        return axios.get(SCHEDULE_API_BASE_URL + '/' + scheduleId);
    }

    updateSchedule(schedule, scheduleId){
        return axios.put(SCHEDULE_API_BASE_URL + '/' + scheduleId, schedule);
    }

    deleteSchedule(scheduleId){
        return axios.delete(SCHEDULE_API_BASE_URL + '/' + scheduleId);
    }
    //getSchedulesByCourse(courseId){
      //  return axios.get(COURSE_API_BASE_URL+'/'+courseId)
    //}

    getCourseIdsByScheduleIds(scheduleIds) {
        return axios.post(COURSE_API_BASE_URL1+'/'+ scheduleIds);
      }
}

export default ScheduleService.getInstance();