import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

interface IBody {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  const article: IBody = await request.json();
  /* db.data.posts.unshift({
    id: Math.random().toString(36).slice(-8),
    ...article,
  });
  await db.write(); */
  await db.update(({ posts }) => {
    posts.unshift({
      id: Math.random().toString(36).slice(-8),
      ...article,
    });
  });
  return NextResponse.json({
    code: 0,
    message: "添加成功",
  });
}
