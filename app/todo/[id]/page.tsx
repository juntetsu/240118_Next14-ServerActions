import { client } from "@/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dataType } from "@/app/todo/page";

type Props = {
  id: string;
};

export default async function page({ params }: { params: Props }) {
  // microCMSからデータ取得
  const data: dataType = await client.get({
    endpoint: "todo",
    queries: {
      fields: "id,title",
      filters: `id[equals]${params.id}`,
    },
  });

  // microCMSへの更新処理
  const updateTodo = async (formData: FormData) => {
    "use server";

    const title = formData.get("title");
    const id = formData.get("id") as string; // ここで型アサーションしないと①でエラーになる
    const sendData = `{"title":"${title}"}`;

    // microCMS-SDKのupdateメソッドを使用
    await client.update({
      endpoint: "todo",
      content: JSON.parse(sendData),
      contentId: id, // ①
    });
    revalidatePath("/todo/[id]", "page");
    revalidatePath("/todo", "page");
    redirect("/todo");
  };

  return (
    <div className="max-w-screen-sm mx-auto mt-8">
      <h2 className="text-2xl font-bold">Create</h2>
      <form
        action={updateTodo}
        className="flex items-center justify-between mt-4"
      >
        <input type="hidden" name="id" value={data.contents[0].id} />
        <input
          type="text"
          name="title"
          placeholder="入力してください"
          defaultValue={data.contents[0].title}
          className="px-4 py-2 border border-gray-300 rounded-md w-[80%]"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          編集
        </button>
      </form>
    </div>
  );
}
