import { WsMiddleware } from './ws.middleware';

describe('WsMiddleware', () => {
  it('should be defined', () => {
    expect(new WsMiddleware()).toBeDefined();
  });
});
