import { createPostInputSchema } from "@/lib/schemas/post-schemas";
import { api } from "@/lib/utils/api";
import { useState, type FC, type FormEvent } from "react";

export const CreatePost: FC = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const context = api.useContext();

  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSuccess: () => {
      setText("");
      context.post.invalidate();
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createPostInputSchema.parse({ text });
    } catch (error) {
      setError((error as { message: string }).message);
    }
    await createPost({ text });
  };

  return (
    <>
      {error && JSON.stringify(error)}
      <form onSubmit={handleSubmit} className="mb-4 flex w-full flex-col rounded-md border-2 p-4 ">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full p-4 shadow"
        />
        <div className="mt-4 flex justify-end">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-white">
            Post
          </button>
        </div>
      </form>
    </>
  );
};
