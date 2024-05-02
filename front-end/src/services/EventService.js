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
    console.time('BackendCall Events');
    const response = await EventService.get(path, {
      params: {
        series_id: serieId,
      },
    });
    console.timeEnd('BackendCall Events');
    return response.data;
  } catch (error) {
    console.error(`Error fetching event data from ${path} by series_id:`, error);
    throw error;
  }
};

EventService.getGameDefaultEventsBySerieId = async (gameTitle, serieId) => {
  return fetchData(`/${gameTitle}`, serieId);
};

EventService.getGameKillsEventsBySerieId = async (gameTitle, serieId) => {
  return fetchData(`/${gameTitle}/kills`, serieId);
};

EventService.getGameAbilitiesEventsBySerieId = async (gameTitle, serieId) => {
  return fetchData(`/${gameTitle}/abilities`, serieId);
};

EventService.getGameEventsNearPointBySerieId = async (gameTitle, serieId) => {
  return fetchData(`/${gameTitle}/near-test`, serieId);
};

EventService.getGameAbilityEventsFollowedByKillEventsBySerieId = async (gameTitle, serieId) => {
  return fetchData(`/${gameTitle}/sequence-test`, serieId);
};

export default EventService;
