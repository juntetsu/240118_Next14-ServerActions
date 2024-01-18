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
      <div>
        <h2>Todo List</h2>
        {data?.contents.map((item, index) => (
          <ul key={index}>
            <li>{item.title}</li>
          </ul>
        ))}
      </div>
    </>
  );
}
