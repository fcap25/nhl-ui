import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TeamDetails() {
    const { teamAbbreviation } = useParams();
    const [teamStats, setTeamStats] = useState(null);

    useEffect(() => {
        const fetchTeamStats = async () => {
            try {
                const response = await axios.get(`https://api-web.nhle.com/v1/club-stats-season/TOR`); // api-web.nhle.com/v1/club-stats/TOR/now - 
                setTeamStats(response.data);
            } catch (error) {
                console.error('Failed to fetch team stats', error);
            }
        };

        if (teamAbbreviation) {
            fetchTeamStats();
        }
    }, [teamAbbreviation]);

    if (!teamStats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{teamStats.teamName} Statistics</h1>
            {/* Display various stats as needed */}
            <p>Games Played: {teamStats.gamesPlayed}</p>
            {/* Additional stats */}
        </div>
    );
}

export default TeamDetails;
