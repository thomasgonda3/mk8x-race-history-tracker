import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      let request = "/api/players";
      let parameters = "?";
      parameters =
        playerName.length === 0
          ? parameters
          : parameters + `playerName=${playerName}`;
      const response = await fetch(request + parameters, {
        method: "GET",
      });
      const result = await response.json();
      setPlayers(result);
    };
    fetchPlayers();
  }, [playerName]);

  return (
    <div>
      <Form className="m-3" controlid="formPlayerName">
        <small className="text-secondary fst-italic">Player Search</small>
        <Form.Group>
          <Form.Control
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Name"
          ></Form.Control>
        </Form.Group>
      </Form>
      <span className="fst-italic m-1">
        {players.length > 0 ? players[0].Overall_Count : 0} results
      </span>
      <Table className="text-center" striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Race Total</th>
            <th>Most Recent Race</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            return (
              <tr
                key={`table-row-${index + 1}`}
                onClick={() => navigate(`/player/${player.ID}`)}
                role="button"
              >
                <td>{player.Name}</td>
                <td>{player.Race_Total}</td>
                <td>{player.Most_Recent_Race}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
