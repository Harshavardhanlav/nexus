import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./AttendanceChart.css";

export function AttendanceChart({ data }) {
  return (
    <div className="attendance-chart card46">
      <div className="attendance-chart__header">
        <h3>Attendance Overview</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#000000" tickLine={false} axisLine={false} />
          <YAxis stroke="#000000" tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#000000" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
