import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';

const today = new Date();

const Datepicker = ({ handleChange, name}) => {

  const [date, setDate] = useState(dayjs());

  const [time, setTime] = useState(dayjs(today));


  // Función para deshabilitar horarios anteriores al horario actual
  const shouldDisableTime = (selectedTime) => {

    const d = `${dayjs(date).format('YYYY-MM-DD')}`
    const t = dayjs(selectedTime).format('HH')
    
    if ( (d == `${dayjs(today).format('YYYY-MM-DD')}`) && `${dayjs(today).format('HH')}` >= t ) {

      console.log('entra al if -- se deshabilita la hora')
      console.log(d)
      console.log(`${dayjs(today).format('YYYY-MM-DD')}`)
      console.log(`${dayjs(today).format('HH')}`)
      console.log(t)

      return true
    }
    else{
      console.log('No entra al if -- se habilita la hora')
      console.log(d)
      console.log(`${dayjs(today).format('YYYY-MM-DD')}`)
      console.log(`${dayjs(today).format('HH')}`)
      console.log(t)
       return false}

  };

  useEffect(() => {
    shouldDisableTime();
  }, [date, time]);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={name === 'date' ? ['DatePicker'] : ['TimeField']}>
        {name === 'date' ? (
          <DatePicker
            label="Elegí un día"
            sx={{ width: 200, textAlign:'center' }}
            value={date}
            onChange={(selectedDate) => {
              setDate(selectedDate)
              handleChange({ name, value:`${dayjs(selectedDate).format('YYYY-MM-DD')}` })
            }}
            disablePast
          />
        ) : (
          <TimeField
            label="Elegí un horario"
            sx={{ width: 200, textAlign:'center' }}
            format="HH:00"
            value = {dayjs(time)}
            shouldDisableTime = {shouldDisableTime}
            onChange={(selectedTime) => {
              if(shouldDisableTime(selectedTime) == false) {
              setTime(selectedTime)      
              handleChange({ name, value:`${dayjs(selectedTime).format('YYYY-MM-DD HH:00')}`}) }
            }}
          />
        )}
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default Datepicker;
