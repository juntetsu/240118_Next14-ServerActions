import { client } from "@/lib/client";
import { revalidatePath } from "next/cache";

type dataType = {
  contents: contentsType[];
  totalCount: number;
  offset: number;
  limit: number;
};
type contentsType = {
  id: string;
  title: string;
};

export default async function Todo() {
  // microCMSからデータ取得
  const data: dataType = await client.get({
    endpoint: "todo",
    queries: { fields: "id,title" },
  });

  const createTodo = async (formData: FormData) => {
    "use server";
    const title = formData.get("title");
    const sendData = `{"title":"${title}"}`;
    // microCMSへの登録処理
    await client.create({
      endpoint: "todo",
      content: JSON.parse(sendData),
    });
    // 登録処理後、/todoをrevalidateする
    revalidatePath("/todo", "page");
  };

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Create</h2>
        <form action={createTodo} className="flex items-center justify-between mt-4">
          <input
            type="text"
            name="title"
            placeholder="入力してください"
            defaultValue={""}
            className="px-4 py-2 border border-gray-300 rounded-md w-[80%]"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            追加
          </button>
        </form>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Todo List</h2>
        <ul className="flex flex-col mt-4">
          {data?.contents.map((item, index) => (
            <li key={item.id} className="border-t py-4 last:border-b">
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
