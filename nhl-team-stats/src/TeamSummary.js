import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';

function TeamSummary() {
    const [teams, setTeams] = useState([]);
    const [expandedId, setExpandedId] = useState(-1); // To track which card is expanded

    useEffect(() => {
        axios.get('/stats/rest/en/team/summary')
            .then(response => {
                setTeams(response.data.data); // Adjust according to actual API response structure
            })
            .catch(error => console.error('Error fetching teams', error));
    }, []);

    const handleExpandClick = (id) => {
        setExpandedId(expandedId === id ? -1 : id); // Toggle expansion
    };

    return (
		<>
		<Typography variant="h3" component="h1" gutterBottom>Welcome to NHL Team Stats!</Typography>
		<Typography variant="h4" component="h1" gutterBottom>Team Summaries</Typography>
        <Grid container spacing={2}>
            {teams.map(team => (
                <Grid item key={team.teamId} xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">{team.teamName}</Typography>
                            <Typography color="textSecondary">Games Played: {team.gamesPlayed}</Typography>
                        </CardContent>
                        <Collapse in={expandedId === team.teamId} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>Wins: {team.wins}</Typography>
                                <Typography paragraph>Losses: {team.losses}</Typography>
                                <Typography paragraph>Points: {team.points}</Typography>
                                <CardActions>
                                    <Button size="small" component={Link} to={`/team/${team.abbreviation}`}>
                                        Full Stats
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
		</>
    );
}

export default TeamSummary;
