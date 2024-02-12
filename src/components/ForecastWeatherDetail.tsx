import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, { WeatherDetailsProps } from './WeatherDetails';
import { tempConverter } from '@/utils/tempConverter';

export interface ForecastWeatherDetailProps extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {

  const {
  weatherIcon = "02d",
  date = "12.02",
  day = "Monday",
  temp,
  feels_like,
  temp_min,
  temp_max,
  description
  } = props;

  return (
    <Container className='gap-4'>
      {/* left side */}
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col gap-1 items-center'>
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        {/*  */}
        <div className='flex flex-col px-4'>
          <span className='text-5xl'>{tempConverter(temp ?? 0)}°</span>
          <p className='text-xs space-x-1 whitespace-nowrap'>
            <span>Feels like</span>
            <span>{tempConverter(feels_like ?? 0)}°</span>
          </p>
          <p className='capitalize'> {description}</p>
        </div>
      </section>
      {/* right side */}
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails {...props} />
      </section>
    </Container>
  )
}