import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button, Collapse, CardMedia, Table, TableContainer, TableRow, TableCell, Paper, TableHead, TableBody, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import Rink from './assets/Ice_Rink.png';

function getLogoPath(abbreviation) {
	try {
	  return require(`./logos/${abbreviation}.svg`);
	} catch (e) {
	  return require('./logo.svg'); // Fallback if logo not found
	}
}

function TeamSummary() {
    const [teams, setTeams] = useState([]);
    const [expandedId, setExpandedId] = useState(-1); // To track which card is expanded
	const [highlightedRow, setHighlightedRow] = useState(null);

	//GET https://api.nhle.com/stats/rest/en/team/summary
	//GET https://api-web.nhle.com/v1/club-stats-season/TEAM_ABBR

	const Abbreviations = {"TOR": "Toronto Maple Leafs", "MTL": "Montréal Canadiens", "OTT": "Ottawa Senators", "VAN": "Vancouver Canucks", "CGY": "Calgary Flames", "EDM": "Edmonton Oilers", "WPG": "Winnipeg Jets", 
	"NSH": "Nashville Predators", "MIN": "Minnesota Wild", "STL": "St. Louis Blues", "CHI": "Chicago Blackhawks", "DET": "Detroit Red Wings", "CBJ": "Columbus Blue Jackets", "BUF": "Buffalo Sabres", 
	"NYR": "New York Rangers", "NYI": "New York Islanders", "NJD": "New Jersey Devils", "PHI": "Philadelphia Flyers", "PIT": "Pittsburgh Penguins", "WSH": "Washington Capitals", "CAR": "Carolina Hurricanes", 
	"TBL": "Tampa Bay Lightning", "FLA": "Florida Panthers", "DAL": "Dallas Stars", "COL": "Colorado Avalanche", "VGK": "Vegas Golden Knights", "ANA": "Anaheim Ducks", "LAK": "Los Angeles Kings", "SJS": "San Jose Sharks", 
	"ARI": "Arizona Coyotes", "BOS": "Boston Bruins", "SEA": "Seattle Kraken", "ATL": "Atlanta Thrashers", "WAS": "Washington Capitals", "WIN": "Winnipeg Jets", "PHX": "Phoenix Coyotes", "MNS": "Minnesota North Stars", 
	"HFD": "Hartford Whalers", "QUE": "Quebec Nordiques"}

	const normalizedAbbreviations = Object.fromEntries(
		Object.entries(Abbreviations).map(([key, value]) => [key, value.toLowerCase().trim()])
	);

    useEffect(() => {
        axios.get('api/stats/rest/en/team/summary?cayenneExp=seasonId=20232024%20and%20gameTypeId=2') //regular season stats for 2023-2024 season
            .then(response => {
                const enrichedTeams = response.data.data.map(team => ({
					...team,
					abbreviation: Object.keys(normalizedAbbreviations).find(key => normalizedAbbreviations[key] === team.teamFullName.toLowerCase().trim()) || 'Default'
				}));
				setTeams(enrichedTeams);
			})
            .catch(error => console.error('Error fetching teams', error));
    }, []);

	//can you sort the teams by points so that i can display the standings in order?
	teams.sort((a, b) => (a.points < b.points) ? 1 : -1);

    const handleExpandClick = (id) => {
        setExpandedId(expandedId === id ? -1 : id); // Toggle expansion
    };

	const scrollToRow = (e, teamId) => {
		//prevent the default behavior of the anchor tag
		e.preventDefault();
		console.log("Scrolling to row:", teamId);
        const row = document.getElementById(`team-row-${teamId}`);
        if (row) {
			console.log("Found row, scrolling now...");
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedRow(teamId); // Set the highlighted row state
            setTimeout(() => {
                setHighlightedRow(null); // Remove highlight after some time
            }, 3000);
        }
    };

    return (
		<div style={{
			backgroundImage: `url(${Rink})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
		}}>
		<Typography variant="h3" component="h1" gutterBottom align='center' padding={2}>Welcome to NHL StatHub!</Typography>
		<Typography variant="h4" component="h1" gutterBottom align='center' >Team Summaries</Typography>
        <Grid container spacing={2} padding={10}>
            {teams.map(team => (
                <Grid item key={team.teamId} xs={12} sm={6} md={2}>
                    <Card style={{backgroundColor: '#0A182F'}}  >
						<CardMedia
							component="img"
							height="140"
							image={getLogoPath(team.abbreviation)}
							alt={team.teamFullName}
						/>
                        <CardContent >
                            <Typography variant="h5" color="white" component="div">{team.teamFullName}</Typography>
                            <Typography color="white">Games Played: {team.gamesPlayed}</Typography>
                        </CardContent>
                        <Collapse in={expandedId === team.teamId} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography color="white" paragraph>Wins: {team.wins}</Typography>
                                <Typography color="white" paragraph>Losses: {team.losses}</Typography>
                                <Typography color="white" paragraph>Points: {team.points}</Typography>
                                <CardActions>
                                    <Button size="small" component={Link} to={`/team/${team.abbreviation}`}>
                                        Full Stats
                                    </Button>
									<Button
    size="small"
    component="a"
    href={`#team-row-${team.teamId}`}
    onClick={(e) => {
        e.preventDefault();
        const row = document.getElementById(`team-row-${team.teamId}`);
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                        <CardActions>
                            <Button size="small" onClick={() => handleExpandClick(team.teamId)}>
                                {expandedId === team.teamId ? 'Less Stats' : 'More Stats'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
		<TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell >Team</TableCell>
                        <TableCell align="right">GP (Games Played)</TableCell>
                        <TableCell align="right">W</TableCell>
                        <TableCell align="right">L</TableCell>
						<TableCell align="right">OT Losses</TableCell>
                        <TableCell align="right">Points</TableCell>
						<TableCell align="right">Goals For</TableCell>
						<TableCell align="right">Goals Against</TableCell>
						<Tooltip title="Penalty Kill Percentage" placement='top-start'>
						<TableCell align="right">PK %</TableCell>
						</Tooltip>
						<TableCell align="right">Shots Per Game</TableCell>
						<TableCell align="right">Shots Against Per Game</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
{teams.map((row) => (
	<TableRow key={row.teamId} id={`team-row-${row.teamId}`} style={{
		backgroundColor: highlightedRow === row.teamId ? '#DFFF00' : '',
		transition: 'background-color 0.3s ease-in-out'
	}}>
		<TableCell component="th" scope="row">
			{row.teamFullName}
		</TableCell>
		<TableCell align="right">{row.gamesPlayed}</TableCell>
		<TableCell align="right">{row.wins}</TableCell>
		<TableCell align="right">{row.losses}</TableCell>
		<TableCell align="right">{row.otLosses}</TableCell>
		<TableCell align="right">{row.points.toFixed(0)}</TableCell>
		<TableCell align="right">{row.goalsFor}</TableCell>
		<TableCell align="right">{row.goalsAgainst}</TableCell>
		<TableCell align="right">{(row.penaltyKillPct * 100).toFixed(0)}%</TableCell>
		<TableCell align="right">{row.shotsForPerGame}</TableCell>
		<TableCell align="right">{row.shotsAgainstPerGame}</TableCell>
	</TableRow>
))}
				</TableBody>
			</Table>
		</TableContainer>
		</div>
	);
}

export default TeamSummary;
