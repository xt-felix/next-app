import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  /* db.data.posts.splice(
    db.data.posts.findIndex((item) => item.id === id),
    1
  );
  await db.write(); */
  await db.update(({ posts }) =>
    posts.splice(
      posts.findIndex((item) => item.id === id),
      1
    )
  );
  return NextResponse.json({
    code: 0,
    message: "删除成功",
  });
};
