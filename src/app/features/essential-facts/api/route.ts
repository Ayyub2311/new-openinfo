import { NextResponse } from "next/server";
import { UserTransformer } from "./transform";
import { ApiError } from "@/app/shared/lib/api/errors";

export async function GET(_req: Request) {
  try {
    // Пример данных
    const userData = {
      id: 1,
      name: "  John Doe  ",
      email: "JOHN@example.com",
      unknownField: "value",
    };

    const result = await UserTransformer.transformResponse(userData);

    if (!result.success) {
      throw ApiError.badRequest(result.error || "Transform failed");
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
