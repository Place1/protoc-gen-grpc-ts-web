// Generated by protoc-gen-grpc-ts-web. DO NOT EDIT!
/* eslint-disable */
/* tslint:disable */

import * as jspb from 'google-protobuf';
import * as grpcWeb from 'grpc-web';

import * as googleProtobufEmpty from 'google-protobuf/google/protobuf/empty_pb';
import * as googleProtobufTimestamp from 'google-protobuf/google/protobuf/timestamp_pb';
import * as googleProtobufDuration from 'google-protobuf/google/protobuf/duration_pb';

export class UserService {

	private client_ = new grpcWeb.GrpcWebClientBase({
		format: 'text',
	});

	private methodInfoAddUser = new grpcWeb.AbstractClientBase.MethodInfo(
		googleProtobufEmpty.Empty,
		(req: User) => req.serializeBinary(),
		googleProtobufEmpty.Empty.deserializeBinary
	);

	private methodInfoListUsers = new grpcWeb.AbstractClientBase.MethodInfo(
		User,
		(req: ListUsersRequest) => req.serializeBinary(),
		User.deserializeBinary
	);

	private methodInfoListUsersByRole = new grpcWeb.AbstractClientBase.MethodInfo(
		User,
		(req: UserRole) => req.serializeBinary(),
		User.deserializeBinary
	);

	private methodInfoUpdateUser = new grpcWeb.AbstractClientBase.MethodInfo(
		User,
		(req: googleProtobufTimestamp.Timestamp) => req.serializeBinary(),
		User.deserializeBinary
	);

	constructor(
		private hostname: string,
		private defaultMetadata?: () => grpcWeb.Metadata,
	) { }

	addUser(req: User.AsObject, metadata?: grpcWeb.Metadata): Promise<googleProtobufEmpty.Empty.AsObject> {
		return new Promise((resolve, reject) => {
			const message = UserFromObject(req);
			this.client_.rpcCall(
				this.hostname + '/example.UserService/AddUser',
				message,
				Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
				this.methodInfoAddUser,
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

	listUsers(req: ListUsersRequest.AsObject, metadata?: grpcWeb.Metadata) {
		const message = new ListUsersRequest();
		message.setCreatedSince(req.createdSince);
		message.setOlderThan(req.olderThan);
		message.setMessage(req.message);
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

	listUsersByRole(req: UserRole.AsObject, metadata?: grpcWeb.Metadata) {
		const message = new UserRole();
		message.setRole(req.role);
		const stream = this.client_.serverStreaming(
			this.hostname + '/example.UserService/ListUsersByRole',
			message,
			Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
			this.methodInfoListUsersByRole,
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

	updateUser(req: googleProtobufTimestamp.Timestamp.AsObject, metadata?: grpcWeb.Metadata): Promise<User.AsObject> {
		return new Promise((resolve, reject) => {
			const message = googleProtobufTimestamp.TimestampFromObject(req);
			this.client_.rpcCall(
				this.hostname + '/example.UserService/UpdateUser',
				message,
				Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
				this.methodInfoUpdateUser,
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

}

export enum Role {
	GUEST = 0,
	MEMBER = 1,
	ADMIN = 2,
}



export declare namespace User {
	export type AsObject = {
		id: number,
		role: Role,
		createDate?: googleProtobufTimestamp.Timestamp.AsObject,
	}
}

export class User extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, User.repeatedFields_, null);
	}


	getId(): number {
		return jspb.Message.getFieldWithDefault(this, 1, 0);
	}

	setId(value: number): void {
		(jspb.Message as any).setProto3IntField(this, 1, value);
	}

	getRole(): Role {
		return jspb.Message.getFieldWithDefault(this, 2, 0);
	}

	setRole(value: Role): void {
		(jspb.Message as any).setProto3EnumField(this, 2, value);
	}

	getCreateDate(): googleProtobufTimestamp.Timestamp {
		return jspb.Message.getWrapperField(this, googleProtobufTimestamp.Timestamp, 3);
	}

	setCreateDate(value?: googleProtobufTimestamp.Timestamp): void {
		(jspb.Message as any).setWrapperField(this, 3, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		User.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): User.AsObject {
		let f: any;
		return {id: this.getId(),
			role: this.getRole(),
			createDate: (f = this.getCreateDate()) && f.toObject(),
			
		};
	}

	static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void {
		const field1 = message.getId();
		if (field1 != 0) {
			writer.writeUint32(1, field1);
		}
		const field2 = message.getRole();
		if (field2 != 0) {
			writer.writeEnum(2, field2);
		}
		const field3 = message.getCreateDate();
		if (field3 != null) {
			writer.writeMessage(3, field3, googleProtobufTimestamp.Timestamp.serializeBinaryToWriter);
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
				const field1 = reader.readUint32()
				message.setId(field1);
				break;
			case 2:
				const field2 = reader.readEnum()
				message.setRole(field2);
				break;
			case 3:
				const field3 = new googleProtobufTimestamp.Timestamp();
				reader.readMessage(field3, googleProtobufTimestamp.Timestamp.deserializeBinaryFromReader);
				message.setCreateDate(field3);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}
export declare namespace UserRole {
	export type AsObject = {
		role: Role,
	}
}

export class UserRole extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, UserRole.repeatedFields_, null);
	}


	getRole(): Role {
		return jspb.Message.getFieldWithDefault(this, 1, 0);
	}

	setRole(value: Role): void {
		(jspb.Message as any).setProto3EnumField(this, 1, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		UserRole.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): UserRole.AsObject {
		let f: any;
		return {role: this.getRole(),
			
		};
	}

	static serializeBinaryToWriter(message: UserRole, writer: jspb.BinaryWriter): void {
		const field1 = message.getRole();
		if (field1 != 0) {
			writer.writeEnum(1, field1);
		}
	}

	static deserializeBinary(bytes: Uint8Array): UserRole {
		var reader = new jspb.BinaryReader(bytes);
		var message = new UserRole();
		return UserRole.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: UserRole, reader: jspb.BinaryReader): UserRole {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
			case 1:
				const field1 = reader.readEnum()
				message.setRole(field1);
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
		user?: User.AsObject,
	}
}

export class UpdateUserRequest extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, UpdateUserRequest.repeatedFields_, null);
	}


	getUser(): User {
		return jspb.Message.getWrapperField(this, User, 1);
	}

	setUser(value?: User): void {
		(jspb.Message as any).setWrapperField(this, 1, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		UpdateUserRequest.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): UpdateUserRequest.AsObject {
		let f: any;
		return {user: (f = this.getUser()) && f.toObject(),
			
		};
	}

	static serializeBinaryToWriter(message: UpdateUserRequest, writer: jspb.BinaryWriter): void {
		const field1 = message.getUser();
		if (field1 != null) {
			writer.writeMessage(1, field1, User.serializeBinaryToWriter);
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
				const field1 = new User();
				reader.readMessage(field1, User.deserializeBinaryFromReader);
				message.setUser(field1);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}
export declare namespace ListUsersRequest {
	export type AsObject = {
		createdSince?: googleProtobufTimestamp.Timestamp.AsObject,
		olderThan?: googleProtobufDuration.Duration.AsObject,
		message: string,
	}
}

export class ListUsersRequest extends jspb.Message {

	private static repeatedFields_ = [
		
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, ListUsersRequest.repeatedFields_, null);
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

	getMessage(): string {
		return jspb.Message.getFieldWithDefault(this, 3, "");
	}

	setMessage(value: string): void {
		(jspb.Message as any).setProto3StringField(this, 3, value);
	}

	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		ListUsersRequest.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): ListUsersRequest.AsObject {
		let f: any;
		return {createdSince: (f = this.getCreatedSince()) && f.toObject(),
			olderThan: (f = this.getOlderThan()) && f.toObject(),
			message: this.getMessage(),
			
		};
	}

	static serializeBinaryToWriter(message: ListUsersRequest, writer: jspb.BinaryWriter): void {
		const field1 = message.getCreatedSince();
		if (field1 != null) {
			writer.writeMessage(1, field1, googleProtobufTimestamp.Timestamp.serializeBinaryToWriter);
		}
		const field2 = message.getOlderThan();
		if (field2 != null) {
			writer.writeMessage(2, field2, googleProtobufDuration.Duration.serializeBinaryToWriter);
		}
		const field3 = message.getMessage();
		if (field3.length > 0) {
			writer.writeString(3, field3);
		}
	}

	static deserializeBinary(bytes: Uint8Array): ListUsersRequest {
		var reader = new jspb.BinaryReader(bytes);
		var message = new ListUsersRequest();
		return ListUsersRequest.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: ListUsersRequest, reader: jspb.BinaryReader): ListUsersRequest {
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
			case 3:
				const field3 = reader.readString()
				message.setMessage(field3);
				break;
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}


function UserFromObject(obj: User.AsObject | undefined): User | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new User();
	message.setId(obj.id);
	message.setRole(obj.role);
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

function UserRoleFromObject(obj: UserRole.AsObject | undefined): UserRole | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new UserRole();
	message.setRole(obj.role);
	return message;
}

function UpdateUserRequestFromObject(obj: UpdateUserRequest.AsObject | undefined): UpdateUserRequest | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new UpdateUserRequest();
	message.setUser(UserFromObject(obj.user));
	return message;
}

function ListUsersRequestFromObject(obj: ListUsersRequest.AsObject | undefined): ListUsersRequest | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new ListUsersRequest();
	message.setCreatedSince(TimestampFromObject(obj.createdSince));
	message.setOlderThan(DurationFromObject(obj.olderThan));
	message.setMessage(obj.message);
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

