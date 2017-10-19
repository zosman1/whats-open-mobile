import 'react-native';
import React from 'react';
import {isOpen , findSchedule} from '../client/data.js'
import {payload} from './payload.js'
let date = new Date('2017-10-18T19:50:04.449Z')

it('checks findSchedule 0', () => {
    expect(findSchedule(0, payload.main_schedule.open_times))
    .toEqual({
        "schedule": 14,
        "modified": "2017-08-27T00:49:28.385241Z",
        "start_day": 0,
        "end_day": 0,
        "start_time": "11:00:00",
        "end_time": "17:00:00"
    });
});
// it('checks findSchedule 1', () => {
//     expect(findSchedule(1, payload.main_schedule.open_times)).toBe(true);
// });
// it('checks findSchedule 2', () => {
//     expect(findSchedule(2, payload.main_schedule.open_times)).toBe(true);
// });
// it('checks findSchedule 3', () => {
//     expect(findSchedule(3, payload.main_schedule.open_times)).toBe(true);
// });
// it('checks findSchedule 4', () => {
//     expect(findSchedule(4, payload.main_schedule.open_times)).toBe(true);
// });
// it('checks findSchedule 5', () => {
//     expect(findSchedule(5, payload.main_schedule.open_times)).toBe(false);
// });


it('checks if isOpen', () => {
    expect(isOpen(payload, date)).toBe(true);
});;
