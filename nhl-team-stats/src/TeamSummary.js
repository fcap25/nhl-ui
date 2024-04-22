/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Badge,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Collapse,
  CardMedia,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  TableBody,
  Tooltip,
  Link,
  CardActionArea,
} from "@mui/material";
import Rink from "./assets/Ice_Rink.png";
import { abbreviations } from "./Abbr";
import TextField from "@mui/material/TextField";

function getLogoPath(abbreviation) {
  try {
    return require(`./logos/${abbreviation}.svg`);
  } catch (e) {
    return require("./logo.svg"); // Fallback if logo not found
  }
}

function TeamSummary() {
  const [teams, setTeams] = useState([]);
  const [expandedId, setExpandedId] = useState(-1); // To track which card is expanded
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //GET https://api.nhle.com/stats/rest/en/team/summary
  //GET https://api-web.nhle.com/v1/club-stats-season/TEAM_ABBR

  const normalizedAbbreviations = Object.fromEntries(
    Object.entries(abbreviations).map(([key, value]) => [
      key,
      value.toLowerCase().trim(),
    ]),
  );

  useEffect(() => {
    axios
      .get(
        "api/stats/rest/en/team/summary?cayenneExp=seasonId=20232024%20and%20gameTypeId=2",
      ) //regular season stats for 2023-2024 season
      .then((response) => {
        const enrichedTeams = response.data.data.map((team) => ({
          ...team,
          abbreviation:
            Object.keys(normalizedAbbreviations).find(
              (key) =>
                normalizedAbbreviations[key] ===
                team.teamFullName.toLowerCase().trim(),
            ) || "Default",
        }));
        setTeams(enrichedTeams);
      })
      .catch((error) => console.error("Error fetching teams", error));
  }, []);

  teams.sort((a, b) => (a.points < b.points ? 1 : -1));

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? -1 : id); // Toggle expansion
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Rink})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" gutterBottom align="center" padding={2}>
        Welcome to NHL StatHub!
      </Typography>
      <Typography variant="h4" gutterBottom align="center">
        Team Summaries
      </Typography>
	  <Typography color="gold" variant="body2" gutterBottom align="center">
		(Current 2023-2024 Season)
	  </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Click on a team to see more stats. (All teams in standings order).
      </Typography>
      <div style={{ display: "flex", justifyContent: "start", marginLeft: 64 }}>
        <TextField
          id="filled-search"
          label="Search Team..."
          type="search"
          variant="filled"
          color="secondary"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          margin="dense"
        />
      </div>
      <Grid container spacing={2} padding={10}>
        {teams
          .filter((team) =>
            team.teamFullName.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((team, index) => (
            <Grid item key={team.teamId} xs={12} sm={6} md={3} xl={2}>
              <Badge
                badgeContent={
                  <Typography fontSize={18}>{index + 1}</Typography>
                }
                color={
                  index === 0
                    ? "success"
                    : index === 1
                      ? "warning"
                      : index === 2
                        ? "error"
                        : "primary"
                }
              >
                <Card
                  style={{
                    backgroundColor: "#0A182F",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                  raised
                >
                  <CardActionArea
                    onClick={() => handleExpandClick(team.teamId)}
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      ":hover": {
                        backgroundColor: "#122B54",
                      },
                      minHeight: "350px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getLogoPath(team.abbreviation)}
                      alt={team.teamFullName}
                    />
                    <CardContent>
                      <Typography variant="h6" color="white" component="div">
                        {team.teamFullName}
                      </Typography>
                      <Typography color="white">
                        Points: {team.points}
                      </Typography>
                    </CardContent>
                    <Collapse
                      in={expandedId === team.teamId}
                      timeout="auto"
                      unmountOnExit
                    >
                      <CardContent>
                        <Typography color="white" paragraph>
                          Wins: {team.wins}
                        </Typography>
                        <Typography color="white" paragraph>
                          Losses: {team.losses}
                        </Typography>
                        <Typography color="white" paragraph>
                          Games Played: {team.gamesPlayed}
                        </Typography>
                        <CardActions>
                          <Button
                            size="small"
                            component={Link}
                            href={`/${team.abbreviation}`}
                          >
                            Player Stats
                          </Button>
                          <Button
                            size="small"
                            component="a"
                            href={`#team-row-${team.teamId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const row = document.getElementById(
                                `team-row-${team.teamId}`,
                              );
                              if (row) {
                                row.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                                setHighlightedRow(team.teamId);
                                setTimeout(() => {
                                  setHighlightedRow(null);
                                }, 3000);
                              }
                            }}
                          >
                            See in Standings
                          </Button>
                        </CardActions>
                      </CardContent>
                    </Collapse>
                  </CardActionArea>
                </Card>
              </Badge>
            </Grid>
          ))}
      </Grid>
      <TableContainer
        component={Paper}
        style={{ marginTop: 20, backgroundColor: "#0A182F" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Team</TableCell>
              <TableCell style={{ color: "white" }} align="right">
                GP (Games Played)
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                W
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                L
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                OT Losses
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                Points
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                Goals For
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                Goals Against
              </TableCell>
              <Tooltip
                style={{ color: "white" }}
                title="Penalty Kill Percentage"
                placement="top-start"
              >
                <TableCell style={{ color: "white" }} align="right">
                  PK %
                </TableCell>
              </Tooltip>
              <TableCell style={{ color: "white" }} align="right">
                Shots Per Game
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                Shots Against Per Game
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((row) => (
              <TableRow
                key={row.teamId}
                id={`team-row-${row.teamId}`}
                style={{
                  backgroundColor:
                    highlightedRow === row.teamId ? "#DFFF00" : "",
                  transition: "background-color 0.3s ease-in-out",
                }}
              >
                <TableCell component="th" scope="row">
                  <Link underline="hover" href={`/${row.abbreviation}`}>
                    {row.teamFullName}
                  </Link>
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.gamesPlayed}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.wins}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.losses}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.otLosses}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.points.toFixed(0)}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.goalsFor}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.goalsAgainst}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {(row.penaltyKillPct * 100).toFixed(0)}%
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.shotsForPerGame}
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  {row.shotsAgainstPerGame}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TeamSummary;
