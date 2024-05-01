import SerieIdService from './SerieIdService';

jest.mock('./SerieIdService', () => {
  return {
    getTeamIdForTeam: jest.fn().mockReturnValue([{"id":123}]),
  };
});

describe('SerieIdService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getTeamIdForTeam', async () => {
    //arrange
    const mockData = [
        { id: 123 }
    ];
    const team = "team name"

    //act
    const response = await SerieIdService.getTeamIdForTeam(team);

    //assert
    expect(response).toEqual(mockData);
  });
});
