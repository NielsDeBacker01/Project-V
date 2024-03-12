import axios from 'axios';

const EventService = {
  api: axios.create({
    baseURL: 'http://localhost:3200/event',
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  async getDefaultEventsBySerieId(serieId) {
    try {
      const response = await this.api.get('/id', {
        params: {
          series_id: serieId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event data by series_id:', error);
      throw error;
    }
  },

  async getKillsEventsBySerieId(serieId) {
    try {
      const response = await this.api.get('/kills', {
        params: {
          series_id: serieId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event data of kills by series_id:', error);
      throw error;
    }
  },

  async getPlayerEventsBySerieId(serieId) {
    try {
      const response = await this.api.get('/players', {
        params: {
          series_id: serieId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event data of players by series_id:', error);
      throw error;
    }
  }
};

export default EventService;
