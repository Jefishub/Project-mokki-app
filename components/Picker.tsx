import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'

export const Picker = () => {
  const [date, setDate] = useState(new Date())

  return <DatePicker date={date} onDateChange={setDate} />
}