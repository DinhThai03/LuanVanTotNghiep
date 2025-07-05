"use client";
import Image from "next/image";
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
    const data = [
        {
            name: "Total",
            count: boys + girls,
            fill: "#ffffff",
        },
        {
            name: "Girls",
            count: girls,
            fill: "#fbcfe8",
        },
        {
            name: "Boys",
            count: boys,
            fill: "#bfdbfe",
        },
    ];

    return (
        <div className="relative w-full h-[75%]">
            <ResponsiveContainer>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="100%"
                    barSize={32}
                    data={data}
                >
                    <RadialBar background dataKey="count" />
                </RadialBarChart>
            </ResponsiveContainer>

            <Image
                src="/maleFemale.png"
                alt="gender icon"
                width={70}
                height={70}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
};

export default CountChart;
