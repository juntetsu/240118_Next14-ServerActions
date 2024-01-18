import { client } from "@/lib/client";

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

  return (
    <>
      <div className="max-w-screen-sm mx-auto mt-10">
        <h2 className="text-2xl font-bold">Todo List</h2>
        <ul className="flex flex-col mt-4">
          {data?.contents.map((item, index) => (
            <li key={item.id} className="border-t py-4 last:border-b">{item.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
