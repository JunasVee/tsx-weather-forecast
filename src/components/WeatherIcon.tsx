import { cn } from "@/utils/cn";
import Image from "next/image";
import React from "react";

type Props = {};

export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & {iconName: string}) {
  return (
    <div {...props} className={cn('relative h-20 w-20')}>
      <Image
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
        alt="Weather Icon"
        height={100}
        width={100}
        className="absolute h-full w-full"
      />
    </div>
  );
}
