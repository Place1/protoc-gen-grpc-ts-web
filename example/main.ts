import { Metadata } from 'grpc-web';
import { UserService } from './example_pb';

// hostname of the grpc-web server
const hostname = window.location.origin;

// a callback to add default metadata
// on each grpc request
function metadata(): Metadata {
  return {};
}

async function main() {
  // create an instance of the generated
  // UserService client
  const client = new UserService(hostname, metadata)

  // unary calls return promises so that
  // you can use async/await
  // calls also take simple json objects
  // no more `new Message()` and `message.setField()`
  // everywhere!
  const user = await client.addUser({
    name: 'hello world',
  });

  // response messages are json objects
  console.log(user.id);
  console.log(user.name);
  console.log(user.createDate);
}
