'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { date: 'Jan', value: 350, previous: 320 },
  { date: 'Feb', value: 400, previous: 380 },
  { date: 'Mar', value: 300, previous: 290 },
  { date: 'Apr', value: 350, previous: 300 },
  { date: 'May', value: 200, previous: 240 },
  { date: 'Jun', value: 400, previous: 320 },
  { date: 'Jul', value: 300, previous: 280 },
  { date: 'Aug', value: 200, previous: 230 },
  { date: 'Sep', value: 450, previous: 380 },
  { date: 'Oct', value: 500, previous: 420 },
  { date: 'Nov', value: 480, previous: 450 },
  { date: 'Dec', value: 400, previous: 390 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-muted-foreground">Current</span>
            <span className="font-semibold text-primary-700">
              {payload[0].value}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-8">
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="font-semibold text-accent-500">
                {payload[1].value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function StatsChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Monthly Performance</h3>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-muted)"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted-foreground)' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted-foreground)' }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="previous"
                fill="var(--color-destructive)"
                radius={[4, 4, 0, 0]}
                name="Previous"
              />
              <Bar
                dataKey="value"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Current"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
