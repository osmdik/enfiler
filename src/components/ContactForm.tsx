"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { ContactSchema, ContactType } from "../scheme/contact";

import { Spinner } from "./Spinner";

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactType>({
    mode: "onBlur",
    resolver: valibotResolver(ContactSchema),
  });

  const messageValue = watch("message", "");
  const messageLength = messageValue.length;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_HYPERFORM_URL as string, data);
      toast.success(
        "送信が完了いたしました。\n自動返信メールをお送りしておりますのでご確認をお願いいたします。"
      );
      reset();
    } catch (error) {
      console.error("Form submit error", error);
      toast.error(
        "送信時にエラーが発生しました。\n恐れ入りますが後でもう一度お試しください。"
      );
    }
  });

  return (
    <form
      method="post"
      onSubmit={onSubmit}
      className="flex w-11/12 mx-auto flex-col items-center justify-center gap-3"
    >
      <div className="w-full">
        <label htmlFor="name" className="inline-block mb-1">
          お名前
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          placeholder="山田 太郎"
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        />
        {errors.name && (
          <span className="self-start text-xs text-red-500">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="email" className="inline-block mb-1">
          メールアドレス
        </label>
        <input
          type="text"
          id="email"
          {...register("email")}
          placeholder="mail@example.com"
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        />
        {errors.email && (
          <span className="self-start text-xs text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="message" className="inline-block mb-1">
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="お問い合わせ内容を入力してください"
          rows={6}
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        ></textarea>
        <div className="pr-1 text-right text-xs text-gray-400">
          {messageLength}/500
        </div>
        {errors.message && (
          <span className="self-start text-xs text-red-500">
            {errors.message.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`block mx-auto py-4 w-48 max-w-1/2 rounded-full bg-slate-200 text-sm text-gray-500 text-center tracking-widest shadow-md transition-all ease-easeInOutBack duration-300 ${
          !isValid || isSubmitting
            ? "cursor-not-allowed opacity-50"
            : "hover:shadow-xl hover:tracking-[.25em]"
        }`}
      >
        {isSubmitting ? <Spinner /> : "送信"}
      </button>
    </form>
  );
};
