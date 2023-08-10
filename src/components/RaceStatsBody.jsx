import React from "react";
import Form from "react-bootstrap/Form";

const RaceStatsBody = (props) => {
  const changeSortOrder = (sortChoice) => {
    if (sortChoice === "Default Track Order") {
      props.setRaceData([
        ...props.raceData.sort((a, b) => a.ingameOrder - b.ingameOrder),
      ]);
    }
    if (sortChoice === "# of Races")
      props.setRaceData([
        ...props.raceData.sort(
          (a, b) => b.races - a.races || a.avgFinish - b.avgFinish
        ),
      ]);
    else if (sortChoice === "Average Finish")
      props.setRaceData([
        ...props.raceData.sort((a, b) => {
          if (a.avgFinish === 0) return 1;
          return a.avgFinish - b.avgFinish || b.races - a.races;
        }),
      ]);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center align-self-center">{`Overall Average Finish: ${
          props.overallAverage === 0
            ? 0
            : Math.round(100 * props.overallAverage) / 100
        }`}</div>
        <div className="col">
          <small className="text-secondary fst-italic">Race Stats Sort</small>
          <Form.Select
            defaultValue="# of Races"
            onChange={(e) => changeSortOrder(e.target.value)}
          >
            <option value="Default Track Order">Default Track Order</option>
            <option value="# of Races"># of Races</option>
            <option value="Average Finish">Average Finish</option>
          </Form.Select>
        </div>
      </div>
    </div>
  );
};

export default RaceStatsBody;
