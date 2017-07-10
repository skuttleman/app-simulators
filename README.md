
# App Simulator

A REST/WebSocket application simulator for integration testing. Isolate your application during automated testing by simulating its dependencies.

## Features

- Simulate your external REST dependencies with a simple javascript configuration
- Each simulated endpoint can be updated and reset at runtime
- Each simulated endpoint tracks requests it receives
- A built-in UI for updating/resetting simulators
- Simulate active WebSocket connections

## Example

`$ npm install --save-dev app-simulators`

```js
// simulator.js
const createSimulators = require('app-simulators');

const simulators = createSimulators({
  simulators: {
    '/users': { //url for simulator
      status: 200, // intial status for static response - defaults to 200
      response: [{ userId: 1, name: 'Jones' }, { userId: 2, name: 'Smith' }], // initial response body for static response - defaults to no body
      delay: 0.1, // time to wait (in seconds) before responding - defaults to 0
      headers: { 'Custom-Header': 'Custom Header Value' }, // headers added to response
      method: 'get', // http request method - defaults to 'get'
      group: 'Users', // used for grouping simulators in the UI
      name: 'Retrieve Users', // name of service being simulated - displayed in UI
      description: 'This endpoint is used to retreive the list of active users' // description - displayed in UI 
    },
    '/users/:userId': [{ // url can have multiple simulators - methods should be unique
      method: 'put',
      group: 'Users'
    }, {
      method: 'post',
      status: 201,
      group: 'Users'
    }, {
      method: 'delete',
      group: 'Users'
    }],
    '/dynamic/service': {
      respond({ query, body }) { // define a custom handler to return status, body, delay, and headers (syncronously or in a Promise)
        if (query['some-query-param'] === undefined) {
          return  { status: 400, delay: 0.5 };
        }
        return doSomethingAsync(body)
          .then(result => ({ body: result, headers: { Cool: 'very' } }));
      },
      delay: 0.1, // the status, body, delay, and headers are overwritten by the result of the "respond" function - if keys exist
      name: 'Dynamic Simulator'
    },
    '/websocket': {
      socket: true, //identifies simulator as a persisten websocket connection instead of http simulator
      echo: true, //automatically send back any message received - defaults to false
      onmessage(socket, message, send) { // optional handler for when a message is received
        send('this broadcasts to everyone');
        send('this goes to the socket the unique id', 'some-uuid');
        socket.send('this goes to the socket connection that sent the message');
        send('this also goes to the socket connection that sent the message', socket.id);
      },
      onopen(socket, id, send) {}, // optional handler for when a connection is established
      onclose(socket, status, send) {} // optional handler for when a connection is closed
    }
  }
});

simulators.listen(8080, () => console.log('Simulators are running on port:', 8080));
```

`$ node simulator.js`

With the simulators running, configure your app's environment to point to the simulators. Each simulator is mounted to `/simulators/<PATH>`:

`$ USERS_SERVICE=http://localhost:8080/simulators/users DYNAMIC_SERVICE=http://localhost:8080/simulators/dynamic/service ./run-my-app.sh`

## REST API

The following API can be used to alter/interact with the simulators at runtime.

### Cross-Simulator API

#### GET /api/simulators

Returns a list of running simulators. This is used to build the UI.

```json
[
    {
        "path": "/some/simulator",
        "method": "POST",
        "name": "Some Simulator",
        "group": "",
        "description": "",
        "socket": false
    }
]
```

#### DELETE /api/reset-all

Resets all requests and responses for all running simulators.

### HTTP Simulator API

Each configured HTTP Simulator has the following interface for updating the simulators once they are running.

#### GET /api/requests/<METHOD>/<PATH>

Returns a list of requests the simulator received in order of

```json
[
    {
        "query": {},
        "body": {},
        "url": "/simulators/some/simulator",
        "params": {},
        "timestamp": "yyyy-mm-ddThh:MM:ss.SSSZ"
    }
]
```

#### DELETE /api/requests/<METHOD>/<PATH>

Deletes the requests received for that simulator.

#### GET /api/response/<METHOD>/<PATH>

Gets the current response for the simulator (without including the request in the `GET /api/requests/<METHOD>/<PATH>` response).

```json
{
  "body": {
    "configured": "response"
  },
  "status": 418,
  "headers": {},
  "delay": 0.01
}
```

#### PUT /api/response/<METHOD>/<PATH>

Sets the response for the simulator. Keys left out of the payload will not be updated.

```json
{
  "body": {
    "new": "body"
  },
  "delay": 0
}
```

Note that the "status" and "headers" will not be updated by this request.

#### DELETE /api/response/<METHOD>/<PATH>

Reset the simulator back its original behavior.

### WebSocket Simulators

Each configured WebSocket Simulator has the following interface for updating the simulators once they are running.

#### GET /api/messages/<PATH>

Returns the socket messages received.

```json
[
    {
        "message": {
          "some": "message"
        },
        "from": "some-uuid",
        "timestamp": "yyyy-mm-ddThh:MM:ss.SSSZ"
    }
]
```

#### POST /api/messages/<PATH>?to=<SOCKETID>

Send the post body as a socket message to the specified socket ID. If the `to` parameter is not included, the message is broadcast to all active connections for the given <PATH>.

#### DELETE /api/messages/<PATH>

Resets the socket messages received.

#### GET /api/clients/<PATH>

Returns a list of UUID's for the currently connected clients.

```json
[
  "some-uuid",
  "some-other-uuid"
]
```

## Changelog

- 0.1.0
  - API test coverage
  - Example app
  - Bare bones UI
  - README.md
