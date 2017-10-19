import 'react-native';
import React from 'react';
import {isOpen , findSchedule} from '../client/data.js'
import {payloadSushi, payloadSouthside} from '../sample_data/payload.js'
let date = new Date('2017-10-18T19:50:04.449Z');

it('checks findSchedule 0', () => {
    expect(findSchedule(0, payloadSushi.main_schedule.open_times))
    .toEqual({
        "schedule": 14,
        "modified": "2017-08-27T00:49:28.385241Z",
        "start_day": 0,
        "end_day": 0,
        "start_time": "11:00:00",
        "end_time": "17:00:00"
    });
});

it('checks if isOpen Sushi', () => {
    expect(isOpen(payloadSushi, date)).toBe(true);
});;

it('checks if isOpen Southside', () => {
    expect(isOpen(payloadSouthside, date)).toBe(true);    
})