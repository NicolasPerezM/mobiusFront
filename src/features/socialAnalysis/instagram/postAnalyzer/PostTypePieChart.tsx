"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PostTypePieChartProps {
  data?: Record<string, number> | null;
}

const sampleData: Record<string, number> = {
  Image: 2,
  Sidecar: 6,
  Video: 4,
};

const COLORS: Record<string, string> = {
  Image: "hsl(227, 22%, 40%, 0.3)", // amber
  Sidecar: "hsl(227, 22%, 40%, 0.7)", // red
  Video: "hsl(227, 22%, 40%, 0.5)", // emerald
};

const PostTypePieChart = ({ data = null }: PostTypePieChartProps) => {
  const rawData = data && Object.keys(data).length > 0 ? data : sampleData;

  const chartData = Object.entries(rawData).map(([name, value]) => ({
    name,
    value,
  }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
        fontSize={12}
      >
        {value}
      </text>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative flex-none">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl font-sora">
            Distribución de Tipos de Publicación
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full absolute top-4 right-4"
                aria-label="Información sobre el gráfico de tipos de publicación"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Este gráfico de pastel muestra la proporción de tipos de
                  publicaciones realizadas en el periodo analizado (imágenes,
                  carruseles, videos).
                </p>
                <p className="text-xs text-muted-foreground">
                  Puedes identificar rápidamente qué formato es el más usado y
                  ajustar tu estrategia de contenido si es necesario.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-sm">
          Evolución de la tasa de engagement a lo largo del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        {/* Contenedor con altura flexible para el gráfico */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap flex-none">
          {chartData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.name] || "#8884d8" }}
              />
              <span className="text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTypePieChart;
