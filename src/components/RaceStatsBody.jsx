import React from "react";
import Form from "react-bootstrap/Form";

const RaceStatsBody = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="col text-center align-self-center m-2">{`Average Finish: ${
            props.overallAverage === 0
              ? 0
              : Math.round(100 * props.overallAverage) / 100
          }`}</div>
          <div className="col text-center align-self-center m-2">{`Average Score: ${
            props.overallScore === 0
              ? 0
              : Math.round(100 * props.overallScore) / 100
          }`}</div>
        </div>
        <div className="col">
          <small className="text-secondary fst-italic">
            Only last races (per track)
          </small>
          <Form.Select
            defaultValue={9999999}
            onChange={(e) => props.setLastLimit(e.target.value)}
          >
            <option value={9999999}>All Races</option>
            <option value={25}>25 Races</option>
            <option value={10}>10 Races</option>
            <option value={5}>5 Races</option>
            <option value={1}>1 Race</option>
          </Form.Select>
        </div>
        <div className="col">
          <small className="text-secondary fst-italic">Race Stats Sort</small>
          <Form.Select
            defaultValue="Weighted Score"
            onChange={(e) => props.setSort(e.target.value)}
          >
            <option value="Default Track Order">Default Track Order</option>
            <option value="# of Races"># of Races</option>
            <option value="Average Finish">Average Finish</option>
            <option value="Average Score">Average Score</option>
            <option value="Weighted Score">Weighted Score</option>
          </Form.Select>
        </div>
      </div>
    </div>
  );
};

export default RaceStatsBody;
