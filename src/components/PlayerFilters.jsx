import React from "react";

import { DatePicker, ConfigProvider } from "antd";
import Form from "react-bootstrap/Form";

const { RangePicker } = DatePicker;

const PlayerFilters = ({
  minDate,
  setMinDate,
  maxDate,
  setMaxDate,
  setMode,
}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-7">
          <small className="text-secondary fst-italic">Date Filter</small>
        </div>
        <div className="col-5">
          <small className="text-secondary fst-italic">Mode Filter</small>
        </div>
        <div className="col-7">
          <ConfigProvider
            theme={{
              token: {
                fontSize: "16px",
              },
            }}
          >
            <RangePicker
              className="w-100 h-100"
              style={{ padding: "4px 11px 4px" }}
              value={[minDate, maxDate]}
              onChange={(dates) => {
                setMinDate(dates[0]);
                setMaxDate(dates[1]);
              }}
            />
          </ConfigProvider>
        </div>
        <div className="col-5">
          <Form.Select
            defaultValue="MogiTournamentWar"
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="All">All Races</option>
            <option value="Mogi">Mogi</option>
            <option value="Tournament">Tournament</option>
            <option value="War">War</option>
            <option value="MogiTournament">Mogi + Tournament</option>
            <option value="MogiTournamentWar">Mogi + Tournament + War</option>
            <option value="Casual">Casual</option>
          </Form.Select>
        </div>
      </div>
    </div>
  );
};

export default PlayerFilters;
