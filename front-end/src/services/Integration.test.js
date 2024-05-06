import EventService from './EventService';

describe('Integration test', () => {
    test('getDefaultEventsBySerieId', async () => {
        //arrange
        const responseData = [
            {events:[{action:"pickedUp",actor:{id:"1",state:{},stateDelta:{},type:"player"},target:{id:"1",state:{},stateDelta:{},type:"item"},type:"player-pickedUp-item"}],occurredAt:"Z",sequenceNumber:1},
            {events:[{action:"used",actor:{id:"1",state:{},stateDelta:{},type:"player"},target:{id:"1",state:{},stateDelta:{},type:"ability"},type:"player-used-ability"}],occurredAt:"Z",sequenceNumber:3}
        ];
    
        //act
        const response = await EventService.getGameDefaultEventsBySerieId("valorant",'test');
    
        //assert
        expect(response).toEqual(responseData);
    });
});