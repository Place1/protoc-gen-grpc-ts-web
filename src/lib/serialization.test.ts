import { BinaryReader, BinaryWriter } from 'google-protobuf';
import { User, UserMarshaller } from '../../example/generated/example_pb';

// jest.mock('grpc-ts-web', () => jest.requireActual('./index'));

describe('serialization', () => {
  describe('compatibility', () => {
    it('should ...', () => {
      const marshaller = new UserMarshaller();

      const user: User = {
        id: 'hello',
        create_date: {
          nanos: 1,
          seconds: 2,
        },
        labels: {
          example: 'hello world',
        },
        more_labels: {},
        name: '',
        names: ['example1', 'example2'],
        roles: [],
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
});
