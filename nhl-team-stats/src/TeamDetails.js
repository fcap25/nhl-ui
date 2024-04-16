import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { abbreviations } from "./Abbr";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Collapse,
  CardContent,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

function getLogoPath(abbreviation) {
  try {
    return require(`./logos/${abbreviation}.svg`);
  } catch (e) {
    return require("./logo.svg"); // Fallback if logo not found
  }
}

function TeamDetails() {
  const { teamAbbreviation } = useParams();
  const [teamStats, setTeamStats] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("20232024");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get(
          `api-web/v1/club-stats-season/${teamAbbreviation}`,
        ); // api-web.nhle.com/v1/club-stats/TOR/now -
        setTeamStats(response.data);
      } catch (error) {
        console.error("Failed to fetch team stats", error);
      }
    };

    const fetchTeamStats = async () => {
      try {
        var tempStats = {};
        const lastFiveSeasons = [
          20232024, 20222023, 20212022, 20202021, 20192020,
        ];
        for (let i = 0; i < lastFiveSeasons.length; i++) {
          const x = lastFiveSeasons[i];
          const response = await axios.get(
            `api-web/v1/club-stats/${teamAbbreviation}/${x}/2`,
          );
          tempStats[x] = response.data;
        }
        setPlayerStats(tempStats);
      } catch (error) {
        console.error("Failed to fetch team stats", error);
      }
    };

    if (teamAbbreviation) {
      fetchRecent();
      fetchTeamStats();
    }
  }, [teamAbbreviation]);

  if (!playerStats) {
    return <div>Loading...</div>;
  }

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleExpandClick = (playerId) => {
    setExpandedId(expandedId === playerId ? null : playerId);
  };

  const teamName = abbreviations[teamAbbreviation] || "Unknown Team";
  //const playoffStatus = playerStats[selectedSeason].gameTypes.includes(3) ? 'Made Playoffs' : 'No Playoffs';

  //trim the teamStats to only include the last 5 seasons
  const playoffFiveSeasons = teamStats.slice(0, 5);

  console.log("szn", playoffFiveSeasons);

  //extract the gameTypes from the last 5 seasons into object where season is the key and gameTypes is the value
  const gameTypes = Object.fromEntries(
    playoffFiveSeasons.map((season) => [season.season, season.gameTypes]),
  );

  console.log("gameTypes", gameTypes);

  const positions = {
    C: "Center",
    D: "Defenseman",
    G: "Goalie",
    L: "Left Wing",
    R: "Right Wing",
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url(${getLogoPath(teamAbbreviation)})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        minHeight: "100vh", // ensure it covers the full view height
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent overlay
          zIndex: 1, // ensure it's above the background image but below the content
        }}
      />
      <Box sx={{ position: "relative", zIndex: 2, p: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          padding={2}
          color={"whitesmoke"}
        >
          {teamName} Advanced Player Statistics
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          padding={2}
          color={"whitesmoke"}
        >
          (Click to expand for Statistics)
        </Typography>
        <Select
          value={selectedSeason}
          onChange={handleSeasonChange}
          inputProps={{ "aria-label": "Without label" }}
          style={{ marginLeft: "10%", width: "80%", backgroundColor: "white" }}
        >
          {Object.keys(playerStats).map((season) => {
            // Format the season string by inserting a hyphen
            const formattedSeason = `${season.substring(0, 4)}-${season.substring(4)}`;
            return (
              <MenuItem key={season} value={season}>
                {formattedSeason}
              </MenuItem>
            );
          })}
        </Select>
        <Chip
          label={
            gameTypes[selectedSeason].includes(3)
              ? "Made Playoffs"
              : "No Playoffs"
          }
          color={
            gameTypes[selectedSeason].includes(3) ? "primary" : "secondary"
          }
          style={{ marginLeft: "10%", marginTop: "1%" }}
        />
        <Grid container spacing={2} padding={4}>
          {playerStats[selectedSeason].skaters.map((player) => (
            <Grid item key={player.playerId} xs={12} sm={6} md={1}>
              <Card
                onClick={() => handleExpandClick(player.playerId)}
                style={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  //height="140"
                  image={player.headshot}
                  alt={`${player.firstName} ${player.lastName}`}
                  //raised={true}
                />
                <CardContent>
                  <Typography variant="h6">{`${player.firstName.default}`}</Typography>
                  <Typography variant="h6">{`${player.lastName.default}`}</Typography>
                  <Typography>{positions[player.positionCode]}`</Typography>
                </CardContent>
                <Collapse
                  in={expandedId === player.playerId}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <Typography>{`Points: ${player.points}`}</Typography>
                    <Typography>{`Goals: ${player.goals}`}</Typography>
                    <Typography>{`Assists: ${player.assists}`}</Typography>
                    <Typography>{`Shooting %: ${(player.shootingPctg * 100).toFixed(0)}`}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box
          bgcolor={"transparent"}
          style={{ "backdrop-filter": "blur(10px)" }}
          padding={2}
        >
          <Typography
            variant="h5"
            color={"whitesmoke"}
            align="start"
            padding={2}
          >
            {teamName} Goalie Statistics
          </Typography>
        </Box>
        <Grid container spacing={2} padding={4}>
          {playerStats[selectedSeason].goalies.map((player) => (
            <Grid item key={player.playerId} xs={12} sm={6} md={1}>
              <Card
                onClick={() => handleExpandClick(player.playerId)}
                style={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  //height="140"
                  image={player.headshot}
                  alt={`${player.firstName} ${player.lastName}`}
                />
                <CardContent>
                  <Typography variant="h6">{`${player.firstName.default}`}</Typography>
                  <Typography variant="h6">{`${player.lastName.default}`}</Typography>
                  <Typography>{`Goalie`}</Typography>
                </CardContent>
                <Collapse
                  in={expandedId === player.playerId}
                  timeout="auto"
                  unmountOnExit
                >
                  <CardContent>
                    <Typography>{`Games Played: ${player.gamesPlayed}`}</Typography>
                    <Typography>{`Games Started: ${player.gamesStarted}`}</Typography>
                    <Typography>{`Goals Against: ${player.goalsAgainst}`}</Typography>
                    <Typography>{`Losses: ${player.losses}`}</Typography>
                    <Typography>{`Points: ${player.points}`}</Typography>
                    <Typography>{`Save %: ${(player.savePercentage * 100).toFixed(0)}`}</Typography>
                    <Typography>{`Saves: ${player.saves}`}</Typography>
                    <Typography>{`Shots Against: ${player.shotsAgainst}`}</Typography>
                    <Typography>{`Shutouts: ${player.shutouts}`}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default TeamDetails;
