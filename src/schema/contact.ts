import {
  email,
  maxLength,
  minLength,
  object,
  Output,
  string,
  StringSchema,
} from "valibot";

const nameSchema: StringSchema<string> = string([
  minLength(1, "必須項目に入力してください。"),
  maxLength(20, "20文字以内でご入力ください。"),
]);

const emailSchema: StringSchema<string> = string([
  minLength(1, "必須項目に入力してください。"),
  maxLength(255, "255文字以内でご入力ください。"),
  email("有効なメールアドレスを入力してください。"),
]);

const messageSchema: StringSchema<string> = string([
  minLength(1, "必須項目に入力してください。"),
  maxLength(500, "500文字以内でご入力ください。"),
]);

export const ContactSchema = object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

export type ContactType = Output<typeof ContactSchema>;
