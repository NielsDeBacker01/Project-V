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

EventService.getDefaultEventsBySerieId = async (serieId) => {
  return fetchData('/id', serieId);
};

EventService.getKillsEventsBySerieId = async (serieId) => {
  return fetchData('/kills', serieId);
};

EventService.getPlayerEventsBySerieId = async (serieId) => {
  return fetchData('/players', serieId);
};

EventService.getPlayerAgainstPlayerEventsBySerieId = async (serieId) => {
  return fetchData('/player-player', serieId);
};

EventService.getItemsAndAbilitiesEventsBySerieId = async (serieId) => {
  return fetchData('/items-and-abilities', serieId);
};

export default EventService;
