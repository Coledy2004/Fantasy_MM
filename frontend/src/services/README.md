# NCAA API Integration

This folder contains services for integrating real NCAA tournament data into the Fantasy March Madness webapp.

## Services

### ncaaApi.js
Direct wrappers around the NCAA API endpoints. These fetch raw data from `https://ncaa-api.henrygd.me`

**Available Functions:**
- `getMariadiMadnessGames(year, month, day)` - Get scoreboard/live games
- `getTournamentStandings()` - Get tournament standings
- `getGameDetails(gameId)` - Get single game details
- `getGameBoxScore(gameId)` - Get game box score with player stats
- `getTeamRankings()` - Get AP Top 25 rankings
- `getAllSchools()` - Get list of all schools
- `getSchedule(year, month)` - Get tournament schedule

### dataTransform.js
Transforms raw NCAA API data into formats our app uses.

**Available Functions:**
- `transformGameDataToPlayers(gameId)` - Convert game box score to player cards
- `getTournamentGamesForDate(year, month, day)` - Get formatted games for a date
- `getLeagueStandingsFromRankings()` - Get standings from AP rankings
- `calculateFantasyScore(player, gameStats)` - Calculate fantasy points from game stats

## Usage Examples

### Get League Standings (Real-Time)
```javascript
import { getLeagueStandingsFromRankings } from '../services/dataTransform';

const standings = await getLeagueStandingsFromRankings();
console.log(standings); // Array of ranked teams
```

### Get Today's Games
```javascript
import { getTournamentGamesForDate } from '../services/dataTransform';

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

const games = await getTournamentGamesForDate(year, month, day);
```

### Get Box Score for a Game
```javascript
import { getGameBoxScore } from '../services/ncaaApi';

const boxScore = await getGameBoxScore('6305900');
console.log(boxScore.teams[0].players); // Player stats
```

## API Documentation

Full API docs: https://ncaa-api.henrygd.me/openapi

**Rate Limit:** 5 requests per second per IP

**Base URL:** https://ncaa-api.henrygd.me

## Available Endpoints

### Scoreboard
`GET /scoreboard/basketball-men/d1/{year}/{month}/{day}`

Returns live scores and games for a given date.

### Game Details
`GET /game/{gameId}`
`GET /game/{gameId}/boxscore`
`GET /game/{gameId}/play-by-play`
`GET /game/{gameId}/scoring-summary`
`GET /game/{gameId}/team-stats`

### Rankings
`GET /rankings/basketball-men/associated-press`

Returns AP Top 25 rankings.

### Standings
`GET /standings/basketball-men/d1`

Returns conference standings.

### Schedule
`GET /schedule/basketball-men/d1/{year}/{month}`

Returns game dates for a month.

## Integration Status

✅ **HomePage** - Integrated to show real NCAA tournament standings
⏳ **AllTeamsPage** - Ready for integration
⏳ **Draft Interface** - Ready for integration
⏳ **Player Details** - Ready for integration

## Error Handling

All services include try-catch blocks and return `null` on error. The app will fall back to mock data if the API is unavailable.

```javascript
const standings = await getLeagueStandingsFromRankings();
if (!standings) {
  // Use mock data as fallback
  useDefaultData();
}
```

## Notes

- The NCAA API data updates frequently during tournament season
- Date format for basketball: YYYY/MM
- Player stats are included in box score data
- School names and rankings come directly from NCAA

## Future Enhancements

1. Cache API responses to reduce requests
2. Add real-time score updates with WebSockets
3. Integrate individual player stats into player cards
4. Add game history and player performance trends
5. Implement scoring algorithm based on actual game stats
