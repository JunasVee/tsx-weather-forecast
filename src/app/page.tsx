"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import { tempConverter } from "@/utils/tempConverter";
import WeatherIcon from "@/components/WeatherIcon";
import { dayOrNight } from "@/utils/dayOrNight";
import WeatherDetails from "@/components/WeatherDetails";
import { mToKm } from "@/utils/mToKm";
import { msToKm } from "@/utils/msToKm";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/forecast?q=jakarta&appid=0c73f54629b6492680c293081047c8a8

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
    // fetch(
    //   'https://api.openweathermap.org/data/2.5/forecast?q=jakarta&appid=0c73f54629b6492680c293081047c8a8'
    //   ).then(res =>
    //   res.json()
    // )
  );

  useEffect(() => {
    refetch();
  }, [place, refetch])

  const firstData = data?.list[0];

  console.log("data", data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today's weather */}
        {loadingCity ? ( <SkeletonLoading /> ) : (
        <>
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temp */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {tempConverter(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Feels like</span>
                  <span>{tempConverter(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>{tempConverter(firstData?.main.temp_min ?? 0)}°↓</span>
                  <span>{tempConverter(firstData?.main.temp_max ?? 0)}°↑</span>
                </p>
              </div>

              {/* time and icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>
                    <WeatherIcon iconName={dayOrNight(d.weather[0].icon, d.dt_txt)} />
                    <p>{tempConverter(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}
              </p>
              <WeatherIcon iconName={dayOrNight(firstData?.weather[0].icon ?? '', firstData?.dt_txt ?? '')} />
            </Container>
            <Container className="bg-yellow-300/100 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={mToKm(firstData?.visibility ?? 10000)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1707603726), 'H:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1707648391), 'H:mm')}
                windSpeed={msToKm(firstData?.wind.speed ?? 3.12)}
              />
            </Container>
            {/* right */}
          </div>
        </section>
        {/* 7 Days Forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">7 Days Forecast</p>
          {firstDataForEachDate.map((d, index) => (
            <ForecastWeatherDetail 
              key={index} 
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
              day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa`}
              humidity={`${d?.main.humidity}%`}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1707603726), "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1707648391), "H:mm"
              )}
              visibility={`${mToKm(d?.visibility ?? 10000)}`}
              windSpeed={`${msToKm(d?.wind.speed ?? 3.12)}`}
            />
          ))}      
          

        </section>
        </>)}
      </main>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* Today's weather */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <div className="animate-pulse w-20 h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-24 h-6 bg-gray-300 rounded"></div>
          </h2>
          <div className="flex justify-between pr-3">
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full">
              {/* Loading weather cards */}
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                >
                  <div className="animate-pulse w-10 h-4 bg-gray-300 rounded"></div>
                  <div className="animate-pulse w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="animate-pulse w-10 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {/* Left column skeleton */}
          <div className="w-36">
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          {/* Right column skeleton */}
          <div className="bg-yellow-300/100 w-full max-w-lg p-6 gap-4 justify-between">
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
      {/* 7 Days Forecast */}
      <section className="flex w-full flex-col gap-4">
        <div className="text-2xl animate-pulse w-24 h-6 bg-gray-300 rounded"></div>
        {/* Loading forecast details */}
        {[...Array(7)].map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-36">
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
              <div className="animate-pulse w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
            <div className="bg-yellow-300/100 w-full max-w-lg p-6 gap-4 justify-between">
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
              <div className="animate-pulse w-full h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}