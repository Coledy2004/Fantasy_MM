// NCAA API Service
// Fetches real tournament data from ncaa-api.henrygd.me

const NCAA_API_BASE = 'https://ncaa-api.henrygd.me';

/**
 * Fetch scoreboard/live games for March Madness
 * Sport: basketball-men, Division: d1
 * Date format: YYYY/MM for basketball
 */
export async function getMariadiMadnessGames(year, month, day) {
  try {
    const response = await fetch(
      `${NCAA_API_BASE}/scoreboard/basketball-men/d1/${year}/${month}/${day}`
    );
    if (!response.ok) throw new Error('Failed to fetch games');
    return await response.json();
  } catch (error) {
    console.error('Error fetching March Madness games:', error);
    return null;
  }
}

/**
 * Fetch tournament standings
 */
export async function getTournamentStandings() {
  try {
    const response = await fetch(
      `${NCAA_API_BASE}/standings/basketball-men/d1`
    );
    if (!response.ok) throw new Error('Failed to fetch standings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching standings:', error);
    return null;
  }
}

/**
 * Fetch game details and box score
 */
export async function getGameDetails(gameId) {
  try {
    const response = await fetch(`${NCAA_API_BASE}/game/${gameId}`);
    if (!response.ok) throw new Error('Failed to fetch game details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

/**
 * Fetch game box score
 */
export async function getGameBoxScore(gameId) {
  try {
    const response = await fetch(`${NCAA_API_BASE}/game/${gameId}/boxscore`);
    if (!response.ok) throw new Error('Failed to fetch box score');
    return await response.json();
  } catch (error) {
    console.error('Error fetching box score:', error);
    return null;
  }
}

/**
 * Fetch team rankings
 */
export async function getTeamRankings() {
  try {
    const response = await fetch(
      `${NCAA_API_BASE}/rankings/basketball-men/associated-press`
    );
    if (!response.ok) throw new Error('Failed to fetch rankings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return null;
  }
}

/**
 * Fetch all schools
 */
export async function getAllSchools() {
  try {
    const response = await fetch(`${NCAA_API_BASE}/schools-index`);
    if (!response.ok) throw new Error('Failed to fetch schools');
    return await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
    return null;
  }
}

/**
 * Get March Madness schedule for a given month
 */
export async function getSchedule(year, month) {
  try {
    const response = await fetch(
      `${NCAA_API_BASE}/schedule/basketball-men/d1/${year}/${month}`
    );
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
}
