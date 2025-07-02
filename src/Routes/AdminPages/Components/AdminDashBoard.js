import { useContext, useMemo, useState, useEffect } from "react";
import { OrderContext } from "../../../Context/orderContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import "../Scss/AdminDashboard.scss";
import { UserContext } from "../../../Context/userContext";
import { ProductContext } from "../../../Context/productContext";
import ResfulAPI from "../../RouteAPI/ResfulAPI";
import { toast } from "react-toastify";

const AdminDasboard = () => {
  const { order } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const { products } = useContext(ProductContext);
  const [Customer, setCustomer] = useState([]);
  const [TotalPay, setTotalpay] = useState(0);
  const [totalOrderComplete, settotalOrderComplete] = useState(0);
  const chartData = useMemo(() => {
    if (!order || order.length === 0) return [];

    let totalPay = 0;
    let orderCompl = 0;
    const grouped = {};
    order.forEach((o) => {
      const date = dayjs(o.created_at).format("YYYY-MM-DD");

      if (!grouped[date]) {
        grouped[date] = { doanhThu: 0, soDon: 0, tongDon: 0 };
      }

      grouped[date].tongDon += 1;

      if (o.status === "Completed") {
        grouped[date].doanhThu += o.total_price;
        grouped[date].soDon += 1;
        totalPay += o.total_price;
        orderCompl += 1;
      }
    });

    setTotalpay(totalPay);
    settotalOrderComplete(orderCompl);

    const dates = Object.keys(grouped);
    if (dates.length === 0) return [];

    const maxTimestamp = Math.max(...dates.map((d) => dayjs(d).unix()));
    const lastDate = dayjs.unix(maxTimestamp);

    const last5Days = Array.from({ length: 5 }).map((_, i) => {
      const currentDay = lastDate.subtract(4 - i, "day");
      const key = currentDay.format("YYYY-MM-DD");
      const data = grouped[key] || { doanhThu: 0, soDon: 0, tongDon: 0 };
      return {
        name: currentDay.format("DD/MM/YYYY"),
        doanhThu: parseFloat((data.doanhThu / 1000000).toFixed(2)),
        soDon: data.soDon,
        tongDon: data.tongDon,
      };
    });

    return last5Days;
  }, [order]);

  const fetchUser = async () => {
    try {
      const response = await ResfulAPI.FetchAllUser(user.token, "Customer");
      if (response.status === 200) {
        setCustomer(response.data.users);
      } else if (response.status === 401) {
        toast.error("You don't have permission!");
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const CacuPrice = (price) => {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toLocaleString("vi-VN")} Tỷ`;
    } else if (price >= 1_000_000) {
      return `${(price / 1_000_000).toLocaleString("vi-VN")} Triệu`;
    } else {
      return `${price.toLocaleString("vi-VN")}đ`;
    }
  };
  useEffect(() => {
    if (user.Authen) {
      fetchUser();
    }
  }, []);
  return (
    <div className="AdminDashBorad-container" style={{ padding: "2rem" }}>
      <div className="About d-flex">
        <div className="AllProduct">
          <label>All products</label>
          <p>{products?.length}</p>
        </div>
        <div className="AllCustomer">
          <label>All Customers</label>
          <p>{Customer?.length}</p>
        </div>
        <div className="TotalPay">
          <label>Total revenue</label>
          <p>{CacuPrice(TotalPay)}</p>
        </div>
        <div className="TotalOrderComplete">
          <label>Order completed</label>
          <p>
            {totalOrderComplete > 10000
              ? totalOrderComplete / 1000
              : totalOrderComplete}{" "}
            {totalOrderComplete > 10000 && "K"}
          </p>
        </div>
      </div>
      <div className="TrackingChart">
        <div className="title">
          <p>Tracking chart</p>
        </div>
        <div className="chart">
          <BarChart
            width={1090}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" tickFormatter={(value) => `${value}Tr`} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "doanhThu") return [`${value} k`, "Doanh thu"];
                if (name === "soDon") return [`${value} đơn`, "Đơn hoàn thành"];
                if (name === "tongDon")
                  return [`${value} đơn`, "Tổng đơn hàng"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="doanhThu"
              fill="#8884d8"
              name="Doanh thu"
            />
            <Bar
              yAxisId="right"
              dataKey="soDon"
              fill="#82ca9d"
              name="Đơn hoàn thành"
            />
            <Bar
              yAxisId="right"
              dataKey="tongDon"
              fill="#ffbb28"
              name="Tổng đơn hàng"
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AdminDasboard;
