/**
 * Determines a specified facilities current schedule.
 *
 * @param facility The facility to find the active schedule for.
 * @returns {*} A schedule object
 */
export const getFacilityActiveSchedule = facility => {
  const curDateTime = new Date();

  for (let i = 0; i < facility.special_schedules.length; i++) {
    const specialSchedule = facility.special_schedules[i];

    const startInParts = specialSchedule.valid_start.split("-");
    const endInParts = specialSchedule.valid_end.split("-");

    const startDate = new Date(
      startInParts[0],
      startInParts[1],
      startInParts[2]
    );
    const endDate = new Date(endInParts[0], endInParts[1], endInParts[2]);

    /*
            TODO: Possible issues may arise by only checking date and not time
                valid_start and valid_end come as dates without times. If a facility,
                such as Southside, closes are 2 am the day a special schedule is in use,
                a user checking between 12am and 2am would receive incorrect information.
                Possible solutions:
                    - API valid_start and valid_end are in the format yyyy-mm-dd-hh-mm-ss (preferred)
                    - Iterate over all schedules, find active schedule for current day of week,
                      then add the time to startDate and endDate before the date checking.
         */
    if (startDate < curDateTime && endDate > curDateTime) {
      return specialSchedule;
    }
  }

  return facility.main_schedule;
};

/**
 * Determines if a specified facility is open.
 *
 * @param facility The facility to find the status for.
 * @returns {boolean} True if the facility is open, otherwise false.
 */
export const isFacilityOpen = facility => {
  const schedule = getFacilityActiveSchedule(facility);

  return isScheduleOpen(schedule);
};

/**
 * Calculates the time until the facility is open.
 * This function does not work correctly if the facility is open.
 *
 * @param schedule The active schedule for the facility.
 * @return {number} The time (in minutes) until the facility opens.
 */
export const calcTimeTillOpen = schedule => {
  const curDateTime = new Date();
  //Converts the JS day of week (0 is sunday), to the API day of week (0 is monday).
  const dayOfWeek = [6, 0, 1, 2, 3, 4, 5][curDateTime.getDay()];

  let timeTillOpen = null; //The time till the facility is open (in ms)

  //Iterates over each schedule, setting the timeTillOpen to be the smallest it can be.
  for (let i = 0; i < schedule.open_times.length; i++) {
    const scheduleEntry = schedule.open_times[i];

    let daysTillOpen = daysTill(dayOfWeek, scheduleEntry.start_day);

    const timeInParts = scheduleEntry.start_time.split(":");

    const openTime = new Date(
      curDateTime.getFullYear(),
      curDateTime.getMonth(),
      curDateTime.getDate() + daysTillOpen,
      timeInParts[0],
      timeInParts[1],
      timeInParts[2]
    );

    const entryTillOpen = openTime - curDateTime;
    if (entryTillOpen > 0 && (!timeTillOpen || entryTillOpen < timeTillOpen)) {
      timeTillOpen = entryTillOpen;
    }
  }

  return timeTillOpen / 60000; //Set to minutes
};

/**
 * Calculates the time until the facility is closed.
 * This function does not work correctly if the facility is closed.
 *
 * @param schedule The active schedule for the facility.
 * @returns {number} The time (in minutes) until the facility closes.
 */
export const calcTimeTillClose = schedule => {
  const curDateTime = new Date();
  //Converts the JS day of week (0 is sunday), to the API day of week (0 is monday).
  const dayOfWeek = [6, 0, 1, 2, 3, 4, 5][curDateTime.getDay()];

  const activeEntry = getActiveEntry(schedule);

  let daysTillClose = daysTill(dayOfWeek, activeEntry.end_day);

  const timeInParts = activeEntry.end_time.split(":");

  const closeTime = new Date(
    curDateTime.getFullYear(),
    curDateTime.getMonth(),
    curDateTime.getDate() + daysTillClose,
    timeInParts[0],
    timeInParts[1],
    timeInParts[2]
  );

  return (closeTime - curDateTime) / 60000;
};

/**
 * Determines whether a schedule is open or closed.
 *
 * @param schedule The schedule to check
 * @returns {boolean} True if a schedule is open, otherwise false.
 */
const isScheduleOpen = schedule => {
  if (schedule.twenty_four_hours) {
    return true;
  }

  return getActiveEntry(schedule) !== null;
};

/**
 * Determines which entry in a specified schedule is active.
 *
 * @param schedule The schedule to determine the active entry.
 * @returns {*} A schedule entry if there is a current active entry. If there are no
 *              active entries (the schedule is closed) returns null.
 */
const getActiveEntry = schedule => {
  const curDateTime = new Date();

  //Converts the JS day of week (0 is sunday), to the API day of week (0 is monday).
  const dayOfWeek = [6, 0, 1, 2, 3, 4, 5][curDateTime.getDay()];

  for (let i = 0; i < schedule.open_times.length; i++) {
    const scheduleEntry = schedule.open_times[i];

    const startTimeInParts = scheduleEntry.start_time.split(":");
    const endTimeInParts = scheduleEntry.end_time.split(":");

    /*
            Only the times are being compared, therefore set the year, month, and date to 0.
         */
    const curTime = new Date(
      0,
      0,
      0,
      curDateTime.getHours(),
      curDateTime.getMinutes(),
      curDateTime.getSeconds()
    );
    const startTime = new Date(
      0,
      0,
      0,
      startTimeInParts[0],
      startTimeInParts[1],
      startTimeInParts[2]
    );
    const endTime = new Date(
      0,
      0,
      0,
      endTimeInParts[0],
      endTimeInParts[1],
      endTimeInParts[2]
    );

    /*
            First block accounts for entries where the end day is larger than the start day
            ex. start day is Monday (0), end day is Tuesday (1)

            Second block Accounts for entries where the end day is smaller than the start day
            ex. start day is Sunday (6), end day is Monday (0)
         */
    if (
      (scheduleEntry.start_day <= scheduleEntry.end_day &&
        dayOfWeek >= scheduleEntry.start_day &&
        dayOfWeek <= scheduleEntry.end_day) ||
      ((scheduleEntry.start_day > scheduleEntry.end_day &&
        dayOfWeek >= scheduleEntry.start_day) ||
        dayOfWeek <= scheduleEntry.end_day)
    ) {
      if (scheduleEntry.start_day === scheduleEntry.end_day) {
        if (curTime > startTime && curTime < endTime) {
          return scheduleEntry;
        }
      } else {
        /*
                    This logic makes sure that if the current day is the start day / end day, the current time
                    is within the start / end times. This is important for cases such as Southside.
                    If this logic was not here, then example: if the day was Friday (4) at 18:00:00,
                    the schedule that starts on Thursday (3) at 07:00:00 and ends on Friday (4) at 02:00:00 would be
                    selected as it is the first to be iterated that either begins or ends on Friday (4)
                    This logic prevents this from occurring and instead selects starting on Friday (4) at 07:00:00 and
                    ending on Saturday (5) at 02:00:00
                 */
        if (
          (dayOfWeek === scheduleEntry.start_day && curTime > startTime) ||
          (dayOfWeek === scheduleEntry.end_day && curTime <= endTime) ||
          (dayOfWeek !== scheduleEntry.start_day &&
            dayOfWeek !== scheduleEntry.end_day)
        ) {
          return scheduleEntry;
        }
      }
    }
  }

  return null;
};

/**
 * Calculates the number of days between dayFrom and dayTo.
 *
 * @param dayFrom The index of the start day (0-6)
 * @param dayTo The index of the end day (0-6)
 * @returns {number} The number of days between the two.
 */
const daysTill = (dayFrom, dayTo) => {
  let days = 0;
  while (dayFrom !== dayTo) {
    days++;
    if (++dayFrom > 6) {
      dayFrom = 0;
    }
  }

  return days;
};
