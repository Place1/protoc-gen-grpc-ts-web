import { BinaryReader, BinaryWriter } from 'google-protobuf';
import { Role, User, UserMarshaller } from '../../example/generated/example_pb';

describe('serialization', () => {
  it('should marshal and unmarshal', () => {
    const marshaller = new UserMarshaller();

    const user: User = {
      id: 'hello',
      create_date: {
        nanos: 1,
        seconds: 2,
      },
      labels: [{ key: 'example', value: 'a' }],
      more_labels: [{ key: 'example', value: { value: 'a' } }],
      name: 'bar',
      names: ['example1', 'example2'],
      roles: [Role.ADMIN, Role.MEMBER],
    };

    const writer = new BinaryWriter();
    marshaller.serializeBinaryToWriter(user, writer);
    const bytes = writer.getResultBuffer();
    expect(bytes.length).toBeGreaterThan(0);

    const reader = new BinaryReader(bytes);
    const unmarshalled = {};
    marshaller.deserializeBinaryFromReader(unmarshalled, reader);

    expect(unmarshalled).toStrictEqual(user);
  });
});
