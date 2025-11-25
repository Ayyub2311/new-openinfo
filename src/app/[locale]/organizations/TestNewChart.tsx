import Chart from "@/app/shared/charts/ApexChart";

const ExampleChart = () => {
  const series = [
    {
      name: "Revenue",
      data: [10, 41, 35, 51, 49, 62, 69],
    },
  ];

  const options = {
    chart: {
      id: "basic-line",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
  };

  return <Chart series={series} options={options} />;
};

export default ExampleChart;
