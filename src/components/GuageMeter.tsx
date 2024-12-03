import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import NumericScale from "../assets/NumericScale";

interface GaugePointerProps {
  isAnimation: boolean;
}

function GaugePointer({ isAnimation }: GaugePointerProps) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  const [displayAngle, setDisplayAngle] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAnimation) {
      setDisplayAngle(valueAngle);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isAnimation, valueAngle]);

  if (!visible || valueAngle === null) return null;

  const pointerHeight = outerRadius * 0.5;
  const baseWidth = 25;

  const tipX = cx + pointerHeight * Math.sin(displayAngle!);
  const tipY = cy - pointerHeight * Math.cos(displayAngle!);

  const halfBase = baseWidth / 2;
  const baseX1 = cx + halfBase * Math.sin(displayAngle! + Math.PI / 2);
  const baseY1 = cy - halfBase * Math.cos(displayAngle! + Math.PI / 2);
  const baseX2 = cx + halfBase * Math.sin(displayAngle! - Math.PI / 2);
  const baseY2 = cy - halfBase * Math.cos(displayAngle! - Math.PI / 2);

  const polygonPoints = `${tipX},${tipY} ${baseX1},${baseY1} ${baseX2},${baseY2}`;

  return (
    <svg>
      <defs>
        <linearGradient
          id="pointerGradient"
          gradientUnits="userSpaceOnUse"
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
        >
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="50%" stopColor="#dadfe8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dadfe8" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polygon points={polygonPoints} fill="url(#pointerGradient)" />
    </svg>
  );
}

function NumericIndicator({
  cx,
  cy,
  value,
}: {
  cx: number;
  cy: number;
  value: number;
}) {
  return (
    <text
      x={cx}
      y={cy + 150}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="24"
      fontWeight="bold"
      style={{ fill: "white" }}
    >
      {value}
      <tspan fontSize="16" fontWeight="normal" dy="5px">
        {" "}
        Mbps
      </tspan>
    </text>
  );
}

function getPercentageForPoint(point: number) {
  const points = [0, 1, 5, 10, 20, 30, 50, 75, 100];
  const intervals = points.length - 1;

  let lowerIndex = -1;
  let upperIndex = -1;
  for (let i = 0; i < points.length - 1; i++) {
    if (point >= points[i] && point <= points[i + 1]) {
      lowerIndex = i;
      upperIndex = i + 1;
      break;
    }
  }

  if (lowerIndex === upperIndex) return (lowerIndex / intervals) * 100;

  const lowerPoint = points[lowerIndex];
  const upperPoint = points[upperIndex];
  const intervalProgress = (point - lowerPoint) / (upperPoint - lowerPoint);

  return ((lowerIndex + intervalProgress) / intervals) * 100;
}

export default function InternetSpeedGauge({
  internetSpeed,
  arcColor,
  status,
}: {
  internetSpeed: number;
  arcColor: string;
  status: boolean;
}) {
  const [width, setWidth] = useState<number>(520);

  const startAngle = -140;
  const endAngle = 140;
  const height = 324;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = 130;

  useEffect(() => {
    let intervalId = null;

    if (!status) {
      intervalId = setInterval(() => {
        setWidth((prevWidth) => (prevWidth === 520 ? 530 : 520));
      }, 400);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [internetSpeed, status]);

  return (
    <div className="relative mb-0 mt-0 flex h-[300px] w-full justify-center md:w-[600px]">
      <GaugeContainer
        width={width}
        height={height}
        startAngle={startAngle}
        endAngle={endAngle}
        value={
          status
            ? internetSpeed >= 100
              ? 100
              : getPercentageForPoint(internetSpeed)
            : 0
        }
        className="relative"
      >
        <GaugeReferenceArc
          radius={outerRadius}
          style={{ stroke: "gray", fill: "none" }}
        />
        <svg>
          <defs>
            <linearGradient
              id="arcGradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="6"
              y2="0"
            >
              <stop offset="0%" stopColor={arcColor} />
            </linearGradient>
          </defs>
          <GaugeValueArc
            radius={outerRadius}
            color="url(#arcGradient)"
            style={{
              stroke: "none",
              fill: "url(#arcGradient)",
              filter: "drop-shadow(0 0 15px rgba(255,255,255,0.5))",
            }}
          />
        </svg>
        <GaugePointer isAnimation={status} />
        {status ? (
          <NumericIndicator cx={cx} cy={cy} value={internetSpeed} />
        ) : (
          <text
            x={cx}
            y={cy + 150}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="22"
            style={{ fill: "#b3b0aa", opacity: 0.5 }}
          >
            Connecting...
          </text>
        )}
      </GaugeContainer>
      <div
        className={`delay-400 absolute left-[150px] top-14 overflow-hidden transition-[width] duration-1000 md:left-[185px] ${
          status ? "w-[80%]" : "w-0"
        }`}
      >
        <NumericScale />
      </div>
    </div>
  );
}
