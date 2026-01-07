import { JSONFilePreset } from "lowdb/node";

interface IData {
  posts: { id: string; title: string; content: string }[];
}

// Read or create db.json
const defaultData = { posts: [] } as IData;

// 注意 db.json 是相对于命令行的目录
const db = await JSONFilePreset("db.json", defaultData);

export default db;
