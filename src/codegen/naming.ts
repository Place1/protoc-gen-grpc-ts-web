export const naming = {
  file: (input: string | undefined) => input!.replace('.proto', '_pb.ts'),
  service: (input: string | undefined) => input!,
  message: (input: string | undefined) => input!,
  field: (input: string | undefined) => input!,
  enum: (input: string | undefined) => input!,
  enumValue: (input: string | undefined) => input!,
  method: (input: string | undefined) => input!,
  marshaller: (input: string | undefined) => `${input!}Marshaller`,
};
