import axios from 'axios';

const EventService = {
  api: axios.create({
    baseURL: 'http://localhost:3200/event',
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  async getEventsBySerieId(serieId) {
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
  }
};

export default EventService;
