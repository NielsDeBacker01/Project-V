import EventService from './EventService';

jest.mock('./EventService', () => {
  return {
    getValorantDefaultEventsBySerieId: jest.fn().mockReturnValue([{"id": 1}, {"id": 2}]),
  };
});

describe('EventService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getValorantDefaultEventsBySerieId', async () => {
    //arrange
    const mockData = [
        { id: 1 },
        { id: 2 }
    ];

    //act
    const response = await EventService.getValorantDefaultEventsBySerieId('0000000');

    //assert
    expect(response).toEqual(mockData);
  });
});
