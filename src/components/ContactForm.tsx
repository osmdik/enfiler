import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Spinner } from "./Spinner";

type FormType = {
  name: string;
  email: string;
  contents: string;
};

export const ContactForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormType>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("contents", data.contents);

      const response = await fetch(
        process.env.NEXT_PUBLIC_HYPERFORM_URL as string,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success(
          "送信が完了いたしました。\n自動返信メールをお送りしておりますのでご確認をお願いいたします。"
        );
      } else {
        toast.error(
          "送信時にエラーが発生しました。\n恐れ入りますが後でもう一度お試しください。"
        );
      }
      reset();
    } catch (error) {
      console.error("Form submit error", error);
      toast.error(
        "送信時にエラーが発生しました。\n恐れ入りますが後でもう一度お試しください。"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-11/12 mx-auto flex-col items-center justify-center gap-3"
    >
      <div className="w-full">
        <label htmlFor="name" className="inline-block mb-1">
          お名前
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "お名前は必須です" })}
          placeholder="例）山田太郎"
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="w-full">
        <label htmlFor="email" className="inline-block mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "メールアドレスは必須です",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
              message: "有効なメールアドレスを入力してください",
            },
          })}
          placeholder="例）example@example.com"
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="w-full">
        <label htmlFor="contents" className="inline-block mb-1">
          お問い合わせ内容
        </label>
        <textarea
          id="contents"
          {...register("contents", {
            required: "お問い合わせ内容は必須です",
          })}
          placeholder="お問い合わせ内容を入力してください"
          rows={6}
          className="w-full border rounded-md p-3 shadow-sm hover:shadow"
        ></textarea>
        {errors.contents && (
          <p className="text-red-500">{errors.contents.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`block mx-auto py-4 w-64 max-w-1/2 rounded-full bg-slate-200 text-sm text-gray-500 text-center tracking-widest shadow-md transition-all ease-easeInOutBack duration-300 ${
          !isValid
            ? "cursor-not-allowed opacity-50"
            : isSubmitting
            ? "cursor-not-allowed"
            : "hover:shadow-xl hover:tracking-[.2em]"
        }`}
      >
        {isSubmitting ? <Spinner /> : "内容を確認の上、送信する"}
      </button>
    </form>
  );
};
