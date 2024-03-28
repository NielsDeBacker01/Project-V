import axios from 'axios';

const baseURL = 'http://localhost:3200/event';

const EventService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchData = async (path, serieId) => {
  try {
    const response = await EventService.get(path, {
      params: {
        series_id: serieId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching event data from ${path} by series_id:`, error);
    throw error;
  }
};

EventService.getValorantDefaultEventsBySerieId = async (serieId) => {
  return fetchData('/valorant/default', serieId);
};

EventService.getValorantKillsEventsBySerieId = async (serieId) => {
  return fetchData('/valorant/kills', serieId);
};

EventService.getValorantPlayerEventsBySerieId = async (serieId) => {
  return fetchData('/valorant/players', serieId);
};

EventService.getValorantPlayerAgainstPlayerEventsBySerieId = async (serieId) => {
  return fetchData('/valorant/player-player', serieId);
};

EventService.getValorantItemsAndAbilitiesEventsBySerieId = async (serieId) => {
  return fetchData('/valorant/items-and-abilities', serieId);
};

EventService.getValorantEventsNearPointBySerieId = async (serieId) => {
  return fetchData('/valorant/near-test', serieId);
};

export default EventService;
