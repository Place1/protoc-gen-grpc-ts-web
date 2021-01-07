// Generated by protoc-gen-grpc-ts-web. DO NOT EDIT!
/* eslint-disable */
/* tslint:disable */

import * as jspb from 'google-protobuf';
import * as grpcWeb from 'grpc-web';

import * as googleProtobufEmpty from 'google-protobuf/google/protobuf/empty_pb';
import * as googleProtobufWrappers from 'google-protobuf/google/protobuf/wrappers_pb';
import * as googleProtobufTimestamp from 'google-protobuf/google/protobuf/timestamp_pb';
import * as googleProtobufDuration from 'google-protobuf/google/protobuf/duration_pb';

export class UserService {

	private client_ = new grpcWeb.GrpcWebClientBase({
		format: 'text',
	});

	private methodInfoAddUser = new grpcWeb.MethodDescriptor<AddUserReq, User>(
		"AddUser",
		null,
		AddUserReq,
		User,
		(req: AddUserReq) => req.serializeBinary(),
		User.deserializeBinary
	);

	private methodInfoListUsers = new grpcWeb.MethodDescriptor<ListUsersReq, User>(
		"ListUsers",
		null,
		ListUsersReq,
		User,
		(req: ListUsersReq) => req.serializeBinary(),
		User.deserializeBinary
	);

	private methodInfoSince = new grpcWeb.MethodDescriptor<googleProtobufTimestamp.Timestamp, googleProtobufEmpty.Empty>(
		"Since",
		null,
		googleProtobufTimestamp.Timestamp,
		googleProtobufEmpty.Empty,
		(req: googleProtobufTimestamp.Timestamp) => req.serializeBinary(),
		googleProtobufEmpty.Empty.deserializeBinary
	);

	constructor(
		private hostname: string,
		private defaultMetadata?: () => grpcWeb.Metadata,
	) { }

	addUser(req: AddUserReq.AsObject, metadata?: grpcWeb.Metadata): Promise<User.AsObject> {
		return new Promise((resolve, reject) => {
			const message = AddUserReqFromObject(req);
			this.client_.rpcCall(
				this.hostname + '/example.UserService/AddUser',
				message,
				Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
				this.methodInfoAddUser,
				(err: grpcWeb.Error, res: User) => {
					if (err) {
						reject(err);
					} else {
						resolve(res.toObject());
					}
				},
			);
		});
	}

	listUsers(req: ListUsersReq.AsObject, metadata?: grpcWeb.Metadata) {
		const message = ListUsersReqFromObject(req);
		const stream = this.client_.serverStreaming(
			this.hostname + '/example.UserService/ListUsers',
			message,
			Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
			this.methodInfoListUsers,
		);
		return {
			onError(callback: (err: grpcWeb.Error) => void) {
				stream.on('error', callback);
			},
			onStatus(callback: (status: grpcWeb.Status) => void) {
				stream.on('status', callback);
			},
			onData(callback: (response: User.AsObject) => void) {
				stream.on('data', (message) => {
					callback(message.toObject());
				});
			},
			onEnd(callback: () => void) {
				stream.on('end', callback);
			},
			cancel() {
				stream.cancel();
			},
		};
	}

	since(req: googleProtobufTimestamp.Timestamp.AsObject, metadata?: grpcWeb.Metadata): Promise<googleProtobufEmpty.Empty.AsObject> {
		return new Promise((resolve, reject) => {
			const message = TimestampFromObject(req);
			this.client_.rpcCall(
				this.hostname + '/example.UserService/Since',
				message,
				Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
				this.methodInfoSince,
				(err: grpcWeb.Error, res: googleProtobufEmpty.Empty) => {
					if (err) {
						reject(err);
					} else {
						resolve(res.toObject());
					}
				},
			);
		});
	}

}

export enum Role {
	GUEST = 0,
	MEMBER = 1,
	ADMIN = 2,
}



export declare namespace AddUserReq {
	export type AsObject = {
		name: string,
	}
}

export class AddUserReq extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, AddUserReq.repeatedFields_, null);
	}


	getName(): string {
		return jspb.Message.getFieldWithDefault(this, 1, "");
	}

	setName(value: string): void {
		(jspb.Message as any).setProto3StringField(this, 1, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		AddUserReq.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): AddUserReq.AsObject {
		let f: any;
		return {name: this.getName(),
			
		};
	}

	static serializeBinaryToWriter(message: AddUserReq, writer: jspb.BinaryWriter): void {
		const field1 = message.getName();
		if (field1.length > 0) {
			writer.writeString(1, field1);
		}
	}

	static deserializeBinary(bytes: Uint8Array): AddUserReq {
		var reader = new jspb.BinaryReader(bytes);
		var message = new AddUserReq();
		return AddUserReq.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: AddUserReq, reader: jspb.BinaryReader): AddUserReq {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
			case 1:
				const field1 = reader.readString()
				message.setName(field1);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}
export declare namespace User {
	export type AsObject = {
		id: string,
		name: string,
		roles: Array<Role>,
		createDate?: googleProtobufTimestamp.Timestamp.AsObject,
	}
}

export class User extends jspb.Message {

	private static repeatedFields_ = [
		3,
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, User.repeatedFields_, null);
	}


	getId(): string {
		return jspb.Message.getFieldWithDefault(this, 1, "");
	}

	setId(value: string): void {
		(jspb.Message as any).setProto3StringField(this, 1, value);
	}

	getName(): string {
		return jspb.Message.getFieldWithDefault(this, 2, "");
	}

	setName(value: string): void {
		(jspb.Message as any).setProto3StringField(this, 2, value);
	}

	getRoles(): Array<Role> {
		return jspb.Message.getFieldWithDefault(this, 3, [0]);
	}

	setRoles(value: Array<Role>): void {
		(jspb.Message as any).setProto3EnumField(this, 3, value);
	}
	
	addRoles(value: Role, index?: number): void {
		return jspb.Message.addToRepeatedField(this, 3, value, index);
	}

	getCreateDate(): googleProtobufTimestamp.Timestamp {
		return jspb.Message.getWrapperField(this, googleProtobufTimestamp.Timestamp, 4);
	}

	setCreateDate(value?: googleProtobufTimestamp.Timestamp): void {
		(jspb.Message as any).setWrapperField(this, 4, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		User.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): User.AsObject {
		let f: any;
		return {id: this.getId(),
			name: this.getName(),
			
			roles: this.getRoles(),createDate: (f = this.getCreateDate()) && f.toObject(),
			
		};
	}

	static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void {
		const field1 = message.getId();
		if (field1.length > 0) {
			writer.writeString(1, field1);
		}
		const field2 = message.getName();
		if (field2.length > 0) {
			writer.writeString(2, field2);
		}
		const field3 = message.getRoles();
		if (field3.length > 0) {
			writer.writeRepeatedEnum(3, field3);
		}
		const field4 = message.getCreateDate();
		if (field4 != null) {
			writer.writeMessage(4, field4, googleProtobufTimestamp.Timestamp.serializeBinaryToWriter);
		}
	}

	static deserializeBinary(bytes: Uint8Array): User {
		var reader = new jspb.BinaryReader(bytes);
		var message = new User();
		return User.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
			case 1:
				const field1 = reader.readString()
				message.setId(field1);
				break;
			case 2:
				const field2 = reader.readString()
				message.setName(field2);
				break;
			case 3:
				// @ts-ignore Property 'isDelimited' does not exist on type 'BinaryReader'
        // The property does exist but @types/google-protobuf is out of date.
				const fieldValues3 = reader.isDelimited()
					? reader.readPackedEnum()
					: [reader.readEnum()];
				for (const value of fieldValues3) {
					message.addRoles(value);
				}
				break;
			case 4:
				const field4 = new googleProtobufTimestamp.Timestamp();
				reader.readMessage(field4, googleProtobufTimestamp.Timestamp.deserializeBinaryFromReader);
				message.setCreateDate(field4);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}
export declare namespace UpdateUserRequest {
	export type AsObject = {
		name?: googleProtobufWrappers.StringValue.AsObject,
	}
}

export class UpdateUserRequest extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, UpdateUserRequest.repeatedFields_, null);
	}


	getName(): googleProtobufWrappers.StringValue {
		return jspb.Message.getWrapperField(this, googleProtobufWrappers.StringValue, 1);
	}

	setName(value?: googleProtobufWrappers.StringValue): void {
		(jspb.Message as any).setWrapperField(this, 1, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		UpdateUserRequest.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): UpdateUserRequest.AsObject {
		let f: any;
		return {name: (f = this.getName()) && f.toObject(),
			
		};
	}

	static serializeBinaryToWriter(message: UpdateUserRequest, writer: jspb.BinaryWriter): void {
		const field1 = message.getName();
		if (field1 != null) {
			writer.writeMessage(1, field1, googleProtobufWrappers.StringValue.serializeBinaryToWriter);
		}
	}

	static deserializeBinary(bytes: Uint8Array): UpdateUserRequest {
		var reader = new jspb.BinaryReader(bytes);
		var message = new UpdateUserRequest();
		return UpdateUserRequest.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: UpdateUserRequest, reader: jspb.BinaryReader): UpdateUserRequest {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
			case 1:
				const field1 = new googleProtobufWrappers.StringValue();
				reader.readMessage(field1, googleProtobufWrappers.StringValue.deserializeBinaryFromReader);
				message.setName(field1);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}
export declare namespace ListUsersReq {
	export type AsObject = {
		createdSince?: googleProtobufTimestamp.Timestamp.AsObject,
		olderThan?: googleProtobufDuration.Duration.AsObject,
	}
}

export class ListUsersReq extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, ListUsersReq.repeatedFields_, null);
	}


	getCreatedSince(): googleProtobufTimestamp.Timestamp {
		return jspb.Message.getWrapperField(this, googleProtobufTimestamp.Timestamp, 1);
	}

	setCreatedSince(value?: googleProtobufTimestamp.Timestamp): void {
		(jspb.Message as any).setWrapperField(this, 1, value);
	}

	getOlderThan(): googleProtobufDuration.Duration {
		return jspb.Message.getWrapperField(this, googleProtobufDuration.Duration, 2);
	}

	setOlderThan(value?: googleProtobufDuration.Duration): void {
		(jspb.Message as any).setWrapperField(this, 2, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		ListUsersReq.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): ListUsersReq.AsObject {
		let f: any;
		return {createdSince: (f = this.getCreatedSince()) && f.toObject(),
			olderThan: (f = this.getOlderThan()) && f.toObject(),
			
		};
	}

	static serializeBinaryToWriter(message: ListUsersReq, writer: jspb.BinaryWriter): void {
		const field1 = message.getCreatedSince();
		if (field1 != null) {
			writer.writeMessage(1, field1, googleProtobufTimestamp.Timestamp.serializeBinaryToWriter);
		}
		const field2 = message.getOlderThan();
		if (field2 != null) {
			writer.writeMessage(2, field2, googleProtobufDuration.Duration.serializeBinaryToWriter);
		}
	}

	static deserializeBinary(bytes: Uint8Array): ListUsersReq {
		var reader = new jspb.BinaryReader(bytes);
		var message = new ListUsersReq();
		return ListUsersReq.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: ListUsersReq, reader: jspb.BinaryReader): ListUsersReq {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
			case 1:
				const field1 = new googleProtobufTimestamp.Timestamp();
				reader.readMessage(field1, googleProtobufTimestamp.Timestamp.deserializeBinaryFromReader);
				message.setCreatedSince(field1);
				break;
			case 2:
				const field2 = new googleProtobufDuration.Duration();
				reader.readMessage(field2, googleProtobufDuration.Duration.deserializeBinaryFromReader);
				message.setOlderThan(field2);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}


function AddUserReqFromObject(obj: AddUserReq.AsObject | undefined): AddUserReq | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new AddUserReq();
	message.setName(obj.name);
	return message;
}

function UserFromObject(obj: User.AsObject | undefined): User | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new User();
	message.setId(obj.id);
	message.setName(obj.name);
	(obj.roles || [])
		.forEach((item) => message.addRoles(item));
	message.setCreateDate(TimestampFromObject(obj.createDate));
	return message;
}

function TimestampFromObject(obj: googleProtobufTimestamp.Timestamp.AsObject | undefined): googleProtobufTimestamp.Timestamp | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new googleProtobufTimestamp.Timestamp();
	message.setSeconds(obj.seconds);
	message.setNanos(obj.nanos);
	return message;
}

function UpdateUserRequestFromObject(obj: UpdateUserRequest.AsObject | undefined): UpdateUserRequest | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new UpdateUserRequest();
	message.setName(StringValueFromObject(obj.name));
	return message;
}

function StringValueFromObject(obj: googleProtobufWrappers.StringValue.AsObject | undefined): googleProtobufWrappers.StringValue | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new googleProtobufWrappers.StringValue();
	message.setValue(obj.value);
	return message;
}

function ListUsersReqFromObject(obj: ListUsersReq.AsObject | undefined): ListUsersReq | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new ListUsersReq();
	message.setCreatedSince(TimestampFromObject(obj.createdSince));
	message.setOlderThan(DurationFromObject(obj.olderThan));
	return message;
}

function DurationFromObject(obj: googleProtobufDuration.Duration.AsObject | undefined): googleProtobufDuration.Duration | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new googleProtobufDuration.Duration();
	message.setSeconds(obj.seconds);
	message.setNanos(obj.nanos);
	return message;
}

function EmptyFromObject(obj: googleProtobufEmpty.Empty.AsObject | undefined): googleProtobufEmpty.Empty | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new googleProtobufEmpty.Empty();
	return message;
}

