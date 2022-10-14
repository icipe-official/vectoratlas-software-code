import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get } from '@nestjs/common';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { AuthUser } from './user.decorator';

@Controller('test')
export class TestController {
  @Get()
  getUser(@AuthUser() user: any) {
    return user;
  }
}

describe('User decorator', () => {
  let testController: TestController;

  function getParamDecoratorFactory() {
    class TestDecorator {
      public test(@AuthUser() value) {
        return value;
      }
    }

    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      TestDecorator,
      'test',
    );
    return args[Object.keys(args)[0]].factory;
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      //providers: [AppService],
    }).compile();

    testController = app.get<TestController>(TestController);
  });

  it('returns user without a data parameter', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const mockUser = { userId: 1, username: 'john' };
    req.user = mockUser;
    const ctx = new ExecutionContextHost(
      [req, res],
      TestController,
      testController.getUser,
    );
    const factory = getParamDecoratorFactory();
    const user = factory(null, ctx);
    expect(testController.getUser(user)).toStrictEqual(req.user);
  });

  it('returns user data if there is a data parameter', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const mockUser = { userId: 1, username: 'john' };
    req.user = mockUser;
    const ctx = new ExecutionContextHost(
      [req, res],
      TestController,
      testController.getUser,
    );
    const factory = getParamDecoratorFactory();
    const user = factory('username', ctx);
    expect(testController.getUser(user)).toStrictEqual(req.user.username);
  });

  it('returns null if the user is null', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    //const mockUser = {userId: 1, username: 'john'};
    req.user = null;
    const ctx = new ExecutionContextHost(
      [req, res],
      TestController,
      testController.getUser,
    );
    const factory = getParamDecoratorFactory();
    const user = factory('username', ctx);
    expect(testController.getUser(user)).toBeUndefined();
  });
});
