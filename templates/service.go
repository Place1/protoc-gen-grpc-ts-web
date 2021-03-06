package templates

import (
	"bytes"
	"fmt"

	"github.com/golang/protobuf/proto"
	"github.com/iancoleman/strcase"

	"log"
	"strings"
	"text/template"

	descriptor "github.com/golang/protobuf/protoc-gen-go/descriptor"
	plugin "github.com/golang/protobuf/protoc-gen-go/plugin"
	"github.com/pkg/errors"
)

var code = `// Generated by protoc-gen-grpc-ts-web. DO NOT EDIT!
/* eslint-disable */
/* tslint:disable */
{{- $file := .}}
{{- $package := .Package}}

import * as jspb from 'google-protobuf';
import * as grpcWeb from 'grpc-web';

{{- if not (eq (len (.GetDependency)) 0) }}
{{range $dependency := .GetDependency}}
import * as {{ importNS $dependency }} from '{{importPath $dependency}}';
{{- end}}
{{- end}}

{{range $service := .Service -}}
export class {{.Name}} {

	private client_ = new grpcWeb.GrpcWebClientBase({
		format: 'text',
	});
{{range $method := .Method}}
	private methodInfo{{$method.Name}} = new grpcWeb.MethodDescriptor<{{requestMessage $method $file}}, {{responseMessage $method $file}}>(
		"{{$method.Name}}",
		null,
		{{requestMessage $method $file}},
		{{responseMessage $method $file}},
		(req: {{requestMessage $method $file}}) => req.serializeBinary(),
		{{responseMessage $method $file}}.deserializeBinary
	);
{{end}}
	constructor(
		private hostname: string,
		private defaultMetadata?: () => grpcWeb.Metadata,
	) { }
{{range $method := .Method}}
{{- if not $method.ClientStreaming -}}
{{- if not $method.ServerStreaming}}
	{{methodName $method}}(req: {{requestObject $method $file}}, metadata?: grpcWeb.Metadata): Promise<{{responseObject $method $file}}> {
		return new Promise((resolve, reject) => {
			const message = {{requestMessage $method $file | stripPackage}}FromObject(req);
			this.client_.rpcCall(
				this.hostname + '/{{$package}}.{{$service.GetName}}/{{$method.GetName}}',
				message,
				Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
				this.methodInfo{{$method.Name}},
				(err: grpcWeb.Error, res: {{responseMessage $method $file}}) => {
					if (err) {
						reject(err);
					} else {
						resolve(res.toObject());
					}
				},
			);
		});
	}
{{end -}}
{{- end -}}
{{- if not $method.ClientStreaming -}}
{{- if $method.ServerStreaming}}
	{{methodName $method}}(req: {{requestObject $method $file}}, metadata?: grpcWeb.Metadata) {
		const message = {{requestMessage $method $file}}FromObject(req);
		const stream = this.client_.serverStreaming(
			this.hostname + '/{{$package}}.{{$service.GetName}}/{{$method.GetName}}',
			message,
			Object.assign({}, this.defaultMetadata ? this.defaultMetadata() : {}, metadata),
			this.methodInfo{{$method.Name}},
		);
		return {
			onError(callback: (err: grpcWeb.Error) => void) {
				stream.on('error', callback);
			},
			onStatus(callback: (status: grpcWeb.Status) => void) {
				stream.on('status', callback);
			},
			onData(callback: (response: {{responseObject $method $file}}) => void) {
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
{{end -}}
{{- end -}}
{{end}}
}
{{- end}}

{{range $enum := .EnumType -}}
export enum {{$enum.GetName}} {
{{- range $value := .GetValue}}
	{{$value.GetName}} = {{$value.GetNumber}},
{{- end}}
}
{{end}}

{{range $message := .MessageType}}
export declare namespace {{messageName $message $file}} {
	export type AsObject = {
{{- range $field := .Field}}
		{{camelFieldName $field}}{{if isOptional $field}}?{{end}}: {{fieldObjectType $field $file}},
{{- end}}
	}
}

export class {{messageName $message $file}} extends jspb.Message {

	private static repeatedFields_ = [
		{{range $field := .Field -}}
		{{- if (isRepeated $field) -}}
		{{$field.GetNumber}},
		{{- end -}}
		{{- end}}
	];

	constructor(data?: jspb.Message.MessageArray) {
		super();
		jspb.Message.initialize(this, data || [], 0, -1, {{messageName $message $file}}.repeatedFields_, null);
	}

{{range $field := .Field}}
	get{{pascalFieldName $field}}(): {{fieldType $field $file}} {
		{{- if (isMap $field)}}
		{{- if isMessage (mapValueField $field)}}
		return jspb.Message.getMapField(this, {{$field.GetNumber}}, false, {{fieldTypeName (mapValueField $field) $file}});
		{{- else}}
		// @ts-ignore Argument of type 'null' is not assignable to parameter of type 'typeof Message'.ts
		// The property does exist but @types/google-protobuf is out of date.
		return jspb.Message.getMapField(this, {{$field.GetNumber}}, false, null);
		{{- end}}
		{{- else if (isMessage $field)}}
		return jspb.Message.{{jspbFieldGetter $field}}(this, {{fieldTypeName $field $file}}, {{$field.GetNumber}});
		{{- else -}}
		return jspb.Message.{{jspbFieldGetter $field}}(this, {{$field.GetNumber}}, {{defaultValue $field}});
		{{- end}}
	}

	{{- if not (isMap $field)}}

	set{{pascalFieldName $field}}(value{{if isOptional $field}}?{{end}}: {{fieldType $field $file}}): void {
		(jspb.Message as any).{{jspbFieldSetter $field}}(this, {{$field.Number}}, value);
	}

	{{- if and (isRepeated $field) (isMessage $field)}}

	add{{pascalFieldName $field}}(value?: {{fieldTypeName $field $file}}, index?: number): {{fieldTypeName $field $file}} {
		return jspb.Message.addToRepeatedWrapperField(this, {{$field.Number}}, value, {{fieldTypeName $field $file}}, index);
	}
	{{- end}}

	{{- if and (isRepeated $field) (not (isMessage $field))}}

	add{{pascalFieldName $field}}(value: {{fieldTypeName $field $file}}, index?: number): void {
		return jspb.Message.addToRepeatedField(this, {{$field.Number}}, value, index);
	}
	{{- end}}
	{{- else}}

	clear{{pascalFieldName $field}}(): {{messageName $message $file}} {
		this.get{{pascalFieldName $field}}().clear();
		return this;
	}
	{{- end}}
{{end}}
	serializeBinary(): Uint8Array {
		const writer = new jspb.BinaryWriter();
		{{messageName $message $file}}.serializeBinaryToWriter(this, writer);
		return writer.getResultBuffer();
	}

	toObject(): {{messageObjectName $message}} {
		let f: any;
		return {
{{- range $field := .Field}}
			{{- if isMap $field}}
			{{camelFieldName $field}}: (f = this.get{{pascalFieldName $field}}()) && f.toObject(),
			{{- else}}
			{{- if isRepeated $field}}
			{{camelFieldName $field}}: this.get{{pascalFieldName $field}}(){{if isMessage $field}}.map((item) => item.toObject()){{end}},
			{{- else -}}
			{{- if isMessage $field}}
			{{camelFieldName $field}}: (f = this.get{{pascalFieldName $field}}()) && f.toObject(),
			{{- else}}
			{{camelFieldName $field}}: this.get{{pascalFieldName $field}}(),
			{{- end}}
			{{- end}}
			{{- end}}
{{- end}}
		};
	}

	static serializeBinaryToWriter(message: {{messageName $message $file}}, writer: jspb.BinaryWriter): void {
{{- range $field := .Field}}
		const field{{$field.Number}} = message.get{{pascalFieldName $field}}();
		if (field{{$field.Number}}{{zeroCheck $field}}) {
			{{- if isMap $field}}
			// @ts-ignore Property 'serializeBinary' does not exist on type 'Map<K, V>'
			// The property does exist but @types/google-protobuf is out of date.
			field{{$field.Number}}.serializeBinary({{$field.Number}}, writer, jspb.BinaryWriter.prototype.{{jspbMapKeyWriter $field}}, jspb.BinaryWriter.prototype.{{jspbMapValueWriter $field}})
			{{- else }}
			writer.{{binaryWriterMethodName $field}}({{$field.Number}}, field{{$field.Number}}
				{{- if (isMessage $field) -}}
				, {{fieldTypeName $field $file}}.serializeBinaryToWriter
				{{- end -}}
			);
			{{- end}}
		}
{{- end}}
	}

	static deserializeBinary(bytes: Uint8Array): {{messageName $message $file}} {
		var reader = new jspb.BinaryReader(bytes);
		var message = new {{messageName $message $file}}();
		return {{messageName $message $file}}.deserializeBinaryFromReader(message, reader);
	}

	static deserializeBinaryFromReader(message: {{messageName $message $file}}, reader: jspb.BinaryReader): {{messageName $message $file}} {
		while (reader.nextField()) {
			if (reader.isEndGroup()) {
				break;
			}
			const field = reader.getFieldNumber();
			switch (field) {
{{- range $field := .Field}}
			case {{$field.Number}}:
{{- if isMap $field}}
				const field{{$field.Number}} = message.get{{pascalFieldName $field}}();
{{- else if (isMessage $field)}}
				const field{{$field.Number}} = new {{fieldTypeName $field $file}}();
				reader.{{binaryReaderMethodName $field}}(field{{$field.Number}}, {{fieldTypeName $field $file}}.deserializeBinaryFromReader);
{{- else}}
{{- if and (isRepeated $field) (not (isString $field))}}
				// @ts-ignore Property 'isDelimited' does not exist on type 'BinaryReader'
				// The property does exist but @types/google-protobuf is out of date.
				const fieldValues{{$field.Number}} = reader.isDelimited()
					? reader.{{binaryReaderMethodNamePacked $field}}()
					: [reader.{{binaryReaderMethodName $field}}()];
{{- else}}
				const field{{$field.Number}} = reader.{{binaryReaderMethodName $field}}()
{{- end -}}
{{- end -}}
{{- if (isRepeated $field)}}
{{- if isMap $field}}
				/* reader.readMessage(value, function(message, reader) {
					jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
					}); */
{{- else if or (isMessage $field) (isString $field)}}
				message.add{{pascalFieldName $field}}(field{{$field.Number}});
{{- else}}
				for (const value of fieldValues{{$field.Number}}) {
					message.add{{pascalFieldName $field}}(value);
				}
{{- end -}}
{{- else}}
				message.set{{pascalFieldName $field}}(field{{$field.Number}});
{{- end}}
				break;
{{- end}}
			default:
				reader.skipField();
				break;
			}
		}
		return message;
	}

}

{{- end}}

{{range $dep := (allMessageDeps $file)}}
function {{$dep.Message.GetName}}FromObject(obj: {{messageTypeToTS $dep.TypeName $file}}.AsObject | undefined): {{messageTypeToTS $dep.TypeName $file}} | undefined {
	if (obj === undefined) {
		return undefined;
	}
	const message = new {{messageTypeToTS $dep.TypeName $file}}();
{{- range $field := .Message.Field}}
	{{- if isMap $field}}
	(obj.{{camelFieldName $field}} || [])
		{{- if isMessage (mapValueField $field)}}
		.forEach((entry) => message.get{{pascalFieldName $field}}().set(entry[0], {{stripPackage (mapValueField $field).TypeName}}FromObject(entry[1])!))
		{{- else }}
		.forEach((entry) => message.get{{pascalFieldName $field}}().set(entry[0], entry[1]));
		{{- end }}
	{{- else if isRepeated $field}}
	(obj.{{camelFieldName $field}} || [])
		{{- if isMessage $field}}
		.map((item) => {{stripPackage $field.TypeName}}FromObject(item))
		{{- end}}
		.forEach((item) => message.add{{pascalFieldName $field}}(item));
	{{- end -}}
	{{- if not (isRepeated $field)}}
	{{if isMessage $field -}}
	message.set{{pascalFieldName $field}}({{stripPackage $field.TypeName}}FromObject(obj.{{camelFieldName $field}}));
	{{- end -}}
	{{if not (isMessage $field) -}}
	message.set{{pascalFieldName $field}}(obj.{{camelFieldName $field}});
	{{- end -}}
	{{end}}
{{- end}}
	return message;
}
{{end}}
`

func funcmap(depLookup map[string]Dependency) template.FuncMap {
	funcs := template.FuncMap{
		"methodName": func(method *descriptor.MethodDescriptorProto) string {
			return strcase.ToLowerCamel(method.GetName())
		},
		"stripPackage": func(str string) string {
			return stripPackage(str)
		},
		"stripProto": func(str string) string {
			return stripProto(str)
		},
		"importPath": func(dependency string) string {
			if strings.HasPrefix(dependency, "google/protobuf") {
				return fmt.Sprintf("google-protobuf/%s_pb", stripProto(dependency))
			}
			return fmt.Sprintf("./%s_pb", stripProto(dependency))
		},
		"importNS": func(dependency string) string {
			return protoPathToNS(dependency)
		},
		"messageName": func(message *descriptor.DescriptorProto, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(fmt.Sprintf(".%s.%s", file.GetPackage(), message.GetName()), file, depLookup)
		},
		"messageObjectName": func(message *descriptor.DescriptorProto) string {
			return message.GetName() + ".AsObject"
		},
		"requestObject": func(method *descriptor.MethodDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(method.GetInputType(), file, depLookup) + ".AsObject"
		},
		"responseObject": func(method *descriptor.MethodDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(method.GetOutputType(), file, depLookup) + ".AsObject"
		},
		"requestMessage": func(method *descriptor.MethodDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(method.GetInputType(), file, depLookup)
		},
		"responseMessage": func(method *descriptor.MethodDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(method.GetOutputType(), file, depLookup)
		},
		"pascalFieldName": func(field *descriptor.FieldDescriptorProto) string {
			name := strcase.ToCamel(field.GetName())
			if isMap(depLookup, field) {
				name = fmt.Sprintf("%sMap", name)
			}
			return name
		},
		"camelFieldName": func(field *descriptor.FieldDescriptorProto) string {
			name := strcase.ToLowerCamel(field.GetName())
			if isMap(depLookup, field) {
				name = fmt.Sprintf("%sMap", name)
			}
			return name
		},
		"typeToMessageProto": func(typeName string) *descriptor.DescriptorProto {
			if value, ok := depLookup[typeName]; ok {
				return value.Message
			}
			panic(fmt.Sprintf("unknown message type: %s", typeName))
		},
		"fieldTypeName": func(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return fieldTypeName(field, file, depLookup)
		},
		"fieldType": func(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto) string {
			if isMap(depLookup, field) {
				m := depLookup[*field.TypeName]
				k := m.Message.Field[0]
				v := m.Message.Field[1]
				return fmt.Sprintf("jspb.Map<%s, %s>", fieldTypeName(k, file, depLookup), fieldTypeName(v, file, depLookup))
			}
			if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return fmt.Sprintf("Array<%s>", fieldTypeName(field, file, depLookup))
			}
			return fieldTypeName(field, file, depLookup)
		},
		"fieldObjectTypeName": func(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto) string {
			return fieldObjectTypeName(field, file, depLookup)
		},
		"fieldObjectType": func(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto) string {
			if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return fmt.Sprintf("Array<%s>", fieldObjectTypeName(field, file, depLookup))
			}
			return fieldObjectTypeName(field, file, depLookup)
		},
		"isRepeated": func(field *descriptor.FieldDescriptorProto) bool {
			return field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED
		},
		"isMessage": func(field *descriptor.FieldDescriptorProto) bool {
			return field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE
		},
		"isMap": func(field *descriptor.FieldDescriptorProto) bool {
			return isMap(depLookup, field)
		},
		"isOptional": func(field *descriptor.FieldDescriptorProto) bool {
			if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return false
			}
			if field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE {
				return true
			}
			return false
		},
		"isString": func(field *descriptor.FieldDescriptorProto) bool {
			return field.GetType() == descriptor.FieldDescriptorProto_TYPE_STRING
		},
		"mapKeyField": func(field *descriptor.FieldDescriptorProto) *descriptor.FieldDescriptorProto {
			m := depLookup[field.GetTypeName()]
			return m.Message.Field[0]
		},
		"mapValueField": func(field *descriptor.FieldDescriptorProto) *descriptor.FieldDescriptorProto {
			m := depLookup[field.GetTypeName()]
			return m.Message.Field[1]
		},
		"jspbMapKeyWriter": func(field *descriptor.FieldDescriptorProto) string {
			return jspbMapKeyWriter(depLookup, field)
		},
		"jspbMapValueWriter": func(field *descriptor.FieldDescriptorProto) string {
			return jspbMapValueWriter(depLookup, field)
		},
		"binaryWriterMethodName": func(field *descriptor.FieldDescriptorProto) string {
			if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return fmt.Sprintf("writeRepeated%s", jspbBinaryReaderWriterMethodName(field))
			}
			return fmt.Sprintf("write%s", jspbBinaryReaderWriterMethodName(field))
		},
		"binaryReaderMethodName": func(field *descriptor.FieldDescriptorProto) string {
			return fmt.Sprintf("read%s", jspbBinaryReaderWriterMethodName(field))
		},
		"binaryReaderMethodNamePacked": func(field *descriptor.FieldDescriptorProto) string {
			return fmt.Sprintf("readPacked%s", jspbBinaryReaderWriterMethodName(field))
		},
		"defaultValue": func(field *descriptor.FieldDescriptorProto) string {
			valueOr := func(value string, fallback string) string {
				if value == "" {
					return fallback
				}
				return value
			}
			defaultValue := func() string {
				switch field.GetType() {
				case descriptor.FieldDescriptorProto_TYPE_FLOAT:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_INT32:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_UINT32:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_SINT32:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_FIXED32:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_SFIXED32:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_INT64:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_UINT64:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_SINT64:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_FIXED64:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_SFIXED64:
					fallthrough
				case descriptor.FieldDescriptorProto_TYPE_DOUBLE:
					return valueOr(field.GetDefaultValue(), "0")
				case descriptor.FieldDescriptorProto_TYPE_BOOL:
					return valueOr(field.GetDefaultValue(), "false")
				case descriptor.FieldDescriptorProto_TYPE_BYTES:
					return fmt.Sprintf(`"%s"`, valueOr(field.GetDefaultValue(), ""))
				case descriptor.FieldDescriptorProto_TYPE_STRING:
					return fmt.Sprintf(`"%s"`, field.GetDefaultValue())
				case descriptor.FieldDescriptorProto_TYPE_ENUM:
					return valueOr(field.GetDefaultValue(), "0")
				case descriptor.FieldDescriptorProto_TYPE_MESSAGE:
					return valueOr(field.GetDefaultValue(), "null")
				}
				log.Fatalf("unknown default for proto field type: %s", field.GetType())
				return ""
			}
			if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return fmt.Sprintf("[%s]", defaultValue())
			}
			return defaultValue()
		},
		"zeroCheck": func(field *descriptor.FieldDescriptorProto) string {
			if isMap(depLookup, field) {
				return ".getLength() > 0"
			} else if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
				return ".length > 0"
			}
			switch field.GetType() {
			case descriptor.FieldDescriptorProto_TYPE_FLOAT:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_DOUBLE:
				return " != 0.0"
			case descriptor.FieldDescriptorProto_TYPE_INT32:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_UINT32:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_SINT32:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_FIXED32:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_SFIXED32:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_INT64:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_UINT64:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_SINT64:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_FIXED64:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_SFIXED64:
				return " != 0"
			case descriptor.FieldDescriptorProto_TYPE_BOOL:
				return " != false"
			case descriptor.FieldDescriptorProto_TYPE_BYTES:
				fallthrough
			case descriptor.FieldDescriptorProto_TYPE_STRING:
				return ".length > 0"
			case descriptor.FieldDescriptorProto_TYPE_ENUM:
				return " != 0"
			case descriptor.FieldDescriptorProto_TYPE_MESSAGE:
				return " != null"
			}
			log.Fatalf("unknown zero check for proto field type: %s", field.GetType())
			return ""
		},
		"jspbFieldGetter": func(field *descriptor.FieldDescriptorProto) string {
			if field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE {
				if isMap(depLookup, field) {
					return "getMapField"
				} else if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
					return "getRepeatedWrapperField"
				}
				return "getWrapperField"
			}
			return "getFieldWithDefault"
		},
		"jspbFieldSetter": func(field *descriptor.FieldDescriptorProto) string {
			return jspbFieldSetterName(field)
		},
		"jspbFieldAdder": func(field *descriptor.FieldDescriptorProto) string {
			if field.GetLabel() != descriptor.FieldDescriptorProto_LABEL_REPEATED {
				log.Fatal("jspbFieldAdder should only be used for repeated fields")
			}
			if field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE {
				return "addToRepeatedWrapperField"
			}
			return "addToRepeatedField"
		},
		"messageTypeToTS": func(typeName string, file *descriptor.FileDescriptorProto) string {
			return messageTypeToTS(typeName, file, depLookup)
		},
		"allMessageDeps": func(file *descriptor.FileDescriptorProto) []Dependency {
			messages := []Dependency{}
			for _, message := range file.GetMessageType() {
				messages = append(messages, depLookup[fmt.Sprintf(".%s.%s", file.GetPackage(), message.GetName())])
			}
			for _, service := range file.GetService() {
				for _, method := range service.GetMethod() {
					if value, ok := depLookup[method.GetInputType()]; ok {
						messages = append(messages, value)
					}
					if value, ok := depLookup[method.GetOutputType()]; ok {
						messages = append(messages, value)
					}
				}
			}
			results := []Dependency{}
			for _, message := range messages {
				results = append(results, recursiveMsgDeps(message, depLookup)...)
			}

			return uniqueMessages(results)
		},
	}
	return funcs
}

func recursiveMsgDeps(message Dependency, depLookup map[string]Dependency) []Dependency {
	messages := []Dependency{message}
	for _, field := range message.Message.GetField() {
		if field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE && !isMap(depLookup, field) {
			messages = append(messages, recursiveMsgDeps(depLookup[field.GetTypeName()], depLookup)...)
		}
	}
	return messages
}

func NewFile(file *descriptor.FileDescriptorProto, depLookup map[string]Dependency) []*plugin.CodeGeneratorResponse_File {
	// well-known proto files from google/protobuf will
	// be provided by the google-protobuf npm package
	if strings.HasPrefix(file.GetName(), "google/protobuf") {
		return []*plugin.CodeGeneratorResponse_File{}
	}
	return []*plugin.CodeGeneratorResponse_File{
		&plugin.CodeGeneratorResponse_File{
			Name:    proto.String(stripProto(file.GetName()) + "_pb.ts"),
			Content: proto.String(run(code, file, depLookup)),
		},
	}
}

func run(tpl string, file *descriptor.FileDescriptorProto, depLookup map[string]Dependency) string {
	t, err := template.New("").Funcs(funcmap(depLookup)).Parse(tpl)
	if err != nil {
		log.Fatal(errors.Wrap(err, "bad service template"))
	}

	buf := &bytes.Buffer{}
	if err := t.Execute(buf, file); err != nil {
		log.Fatal(errors.Wrap(err, "bad service template"))
	}

	return buf.String()
}

func unique(strs []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range strs {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func uniqueMessages(msgs []Dependency) []Dependency {
	keys := make(map[string]bool)
	list := []Dependency{}
	for _, entry := range msgs {
		if _, value := keys[entry.TypeName]; !value {
			keys[entry.TypeName] = true
			list = append(list, entry)
		}
	}
	return list
}

func stripProto(str string) string {
	return strings.TrimSuffix(str, ".proto")
}

func stripPackage(str string) string {
	parts := strings.Split(str, ".")
	return parts[len(parts)-1]
}

func protoPathToNS(path string) string {
	path = stripProto(path)
	parts := strings.Split(path, "/")
	return strcase.ToLowerCamel(strings.Join(parts, "_"))
}

func messageTypeToTS(typeName string, currentFile *descriptor.FileDescriptorProto, depLookup map[string]Dependency) string {
	depfile, ok := depLookup[typeName]
	if !ok {
		return "any" // TODO: we didn't find the message in any input protos
	}
	if depfile.File != currentFile.GetName() {
		return fmt.Sprintf("%s.%s", protoPathToNS(depfile.File), stripPackage(typeName))
	}
	return stripPackage(typeName)
}

type Dependency struct {
	File     string
	TypeName string
	Message  *descriptor.DescriptorProto
	Enum     *descriptor.EnumDescriptorProto
}

func NewDependencyLookupTable(req *plugin.CodeGeneratorRequest) map[string]Dependency {
	lookup := map[string]Dependency{}
	for _, f := range req.ProtoFile {
		for _, m := range f.GetMessageType() {
			qualified := fmt.Sprintf(".%s.%s", f.GetPackage(), m.GetName())
			lookup[qualified] = Dependency{
				File:     f.GetName(),
				TypeName: qualified,
				Message:  m,
			}
			for _, n := range m.NestedType {
				qualified := fmt.Sprintf(".%s.%s.%s", f.GetPackage(), m.GetName(), n.GetName())
				lookup[qualified] = Dependency{
					File:     f.GetName(),
					TypeName: qualified,
					Message:  n,
				}
			}
		}
		for _, e := range f.GetEnumType() {
			qualified := fmt.Sprintf(".%s.%s", f.GetPackage(), e.GetName())
			lookup[qualified] = Dependency{
				File:     f.GetName(),
				TypeName: qualified,
				Enum:     e,
			}
		}
	}
	return lookup
}

func fieldTypeName(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto, depLookup map[string]Dependency) string {
	switch field.GetType() {
	case descriptor.FieldDescriptorProto_TYPE_FLOAT:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_INT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_UINT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SINT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_FIXED32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SFIXED32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_INT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_UINT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SINT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_FIXED64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SFIXED64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_DOUBLE:
		return "number"
	case descriptor.FieldDescriptorProto_TYPE_STRING:
		return "string"
	case descriptor.FieldDescriptorProto_TYPE_BOOL:
		return "boolean"
	case descriptor.FieldDescriptorProto_TYPE_BYTES:
		return "Uint8Array | string"
	case descriptor.FieldDescriptorProto_TYPE_ENUM:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_MESSAGE:
		return messageTypeToTS(field.GetTypeName(), file, depLookup)
	}
	log.Fatalf("unknown field type: %s", field.GetTypeName())
	return ""
}

func fieldObjectTypeName(field *descriptor.FieldDescriptorProto, file *descriptor.FileDescriptorProto, depLookup map[string]Dependency) string {
	if isMap(depLookup, field) {
		m := depLookup[field.GetTypeName()]
		k := m.Message.Field[0]
		v := m.Message.Field[1]
		return fmt.Sprintf("[%s, %s]", fieldObjectTypeName(k, file, depLookup), fieldObjectTypeName(v, file, depLookup))
	}
	switch field.GetType() {
	case descriptor.FieldDescriptorProto_TYPE_MESSAGE:
		return fmt.Sprintf("%s.AsObject", fieldTypeName(field, file, depLookup))
	}
	return fieldTypeName(field, file, depLookup)
}

func jspbBinaryReaderWriterMethodName(field *descriptor.FieldDescriptorProto) string {
	switch field.GetType() {
	case descriptor.FieldDescriptorProto_TYPE_FLOAT:
		return "Float"
	case descriptor.FieldDescriptorProto_TYPE_INT32:
		return "Int32"
	case descriptor.FieldDescriptorProto_TYPE_UINT32:
		return "Uint32"
	case descriptor.FieldDescriptorProto_TYPE_SINT32:
		return "SInt32"
	case descriptor.FieldDescriptorProto_TYPE_FIXED32:
		return "Fixed32"
	case descriptor.FieldDescriptorProto_TYPE_SFIXED32:
		return "SFixed32"
	case descriptor.FieldDescriptorProto_TYPE_INT64:
		return "Int64"
	case descriptor.FieldDescriptorProto_TYPE_UINT64:
		return "UInt64"
	case descriptor.FieldDescriptorProto_TYPE_SINT64:
		return "SInt64"
	case descriptor.FieldDescriptorProto_TYPE_FIXED64:
		return "Fixed64"
	case descriptor.FieldDescriptorProto_TYPE_SFIXED64:
		return "SFixed64"
	case descriptor.FieldDescriptorProto_TYPE_DOUBLE:
		return "Double"
	case descriptor.FieldDescriptorProto_TYPE_STRING:
		return "String"
	case descriptor.FieldDescriptorProto_TYPE_BOOL:
		return "Bool"
	case descriptor.FieldDescriptorProto_TYPE_BYTES:
		return "Bytes"
	case descriptor.FieldDescriptorProto_TYPE_ENUM:
		return "Enum"
	case descriptor.FieldDescriptorProto_TYPE_MESSAGE:
		return "Message"
	}
	log.Fatalf("unknown proto type: %s", field.GetTypeName())
	return ""
}

func jspbFieldSetterName(field *descriptor.FieldDescriptorProto) string {
	if field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE {
		if field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED {
			return "setRepeatedWrapperField"
		}
		return "setWrapperField"
	}
	switch field.GetType() {
	case descriptor.FieldDescriptorProto_TYPE_INT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_UINT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SINT32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_FIXED32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SFIXED32:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_INT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_UINT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SINT64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_FIXED64:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_SFIXED64:
		return "setProto3IntField"
	case descriptor.FieldDescriptorProto_TYPE_FLOAT:
		fallthrough
	case descriptor.FieldDescriptorProto_TYPE_DOUBLE:
		return "setProto3FloatField"
	case descriptor.FieldDescriptorProto_TYPE_STRING:
		return "setProto3StringField"
	case descriptor.FieldDescriptorProto_TYPE_BOOL:
		return "setProto3BooleanField"
	case descriptor.FieldDescriptorProto_TYPE_BYTES:
		return "setProto3BytesField"
	case descriptor.FieldDescriptorProto_TYPE_ENUM:
		return "setProto3EnumField"
	}
	log.Fatalf("unknown proto type: %s", field.GetTypeName())
	return ""
}

func isMap(depLookup map[string]Dependency, field *descriptor.FieldDescriptorProto) bool {
	isRepeated := field.GetLabel() == descriptor.FieldDescriptorProto_LABEL_REPEATED
	isMessage := field.GetType() == descriptor.FieldDescriptorProto_TYPE_MESSAGE
	hasTypeName := field.GetTypeName() != ""
	if isRepeated && isMessage && hasTypeName {
		if m, ok := depLookup[field.GetTypeName()]; ok {
			if len(m.Message.Field) == 2 {
				if m.Message.Field[0].GetName() == "key" && m.Message.Field[1].GetName() == "value" {
					return true
				}
			}
		}
	}
	return false
}

func jspbMapKeyWriter(depLookup map[string]Dependency, field *descriptor.FieldDescriptorProto) string {
	m := depLookup[field.GetTypeName()]
	k := m.Message.Field[0]
	return fmt.Sprintf("write%s", jspbBinaryReaderWriterMethodName(k))
}

func jspbMapValueWriter(depLookup map[string]Dependency, field *descriptor.FieldDescriptorProto) string {
	m := depLookup[field.GetTypeName()]
	k := m.Message.Field[1]
	return fmt.Sprintf("write%s", jspbBinaryReaderWriterMethodName(k))
}
