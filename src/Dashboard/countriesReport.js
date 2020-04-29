import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { PieChartWrapper, colors } from "./styles";
import { addDays } from "date-fns";
import CustomDatePicker from "./datepicker";
import { queryReport } from "./queryReport";

const CountriesReport = () => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
    colors: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [startDate, setStartDate] = useState(addDays(new Date(), -10));
  const [endDate, setEndDate] = useState(new Date());
  const [totalCoutries, setTotalCountries] = useState(0);

  const displayResults = (response) => {
    const queryResult = response.result.reports[0].data.rows;
    setTotalCountries(queryResult.length);
    let labels = [];
    let values = [];
    let bgColors = [];
    queryResult.forEach((row, idx) => {
      if (idx < 5) {
        labels.push(row.dimensions[0]);
        values.push(row.metrics[0].values[0]);
        bgColors.push(colors[idx + 1]);
      }
    });
    setReportData({
      ...reportData,
      labels,
      values,
      colors: bgColors,
    });
  };

  const data = {
    labels: reportData.labels,
    datasets: [
      {
        data: reportData.values,
        backgroundColor: reportData.colors,
      },
    ],
  };

  useEffect(() => {
    const request = {
      startDate,
      endDate,
      metrics: "ga:users",
      dimensions: ["ga:country"],
      orderBy: {
        fieldName: "ga:users",
        order: "DESCENDING",
      },
    };
    queryReport(request)
      .then((resp) => displayResults(resp))
      .catch((error) => console.error(error));
  }, [startDate, endDate]);

  return (
    <>
      <h2>Top 5 Countries by Users</h2>
      <h4>{`Total countries - ${totalCoutries}`}</h4>
      <CustomDatePicker
        placeholder={"Start date"}
        date={startDate}
        handleDateChange={(date) => setStartDate(date)}
      />
      <CustomDatePicker
        placeholder={"End date"}
        date={endDate}
        handleDateChange={(date) => setEndDate(date)}
      />
      {reportData && (
        <PieChartWrapper>
          <Pie data={data} />
        </PieChartWrapper>
      )}
    </>
  );
};

export default CountriesReport;
