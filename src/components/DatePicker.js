import React from 'react'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import { toLocalISOString } from '../utils'

const DatePicker = ({ selectedDay, chosePeriod }) => {
  const placeholder = toLocalISOString(selectedDay).slice(0, 10)
  return (
    <div className='komz-chart-datepicker'>
      <DayPickerInput
        placeholder={placeholder}
        onDayChange={chosePeriod}
        dayPickerProps={{
          firstDayOfWeek: 1,
          month: selectedDay
        }}
      />
    </div>
  )
}

export default DatePicker
