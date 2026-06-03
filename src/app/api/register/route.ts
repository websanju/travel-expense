import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      password,
    } = body;

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return Response.json(
        {
          error:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingEmail =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingEmail) {
      return Response.json(
        {
          error:
            "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingPhone =
      await prisma.user.findUnique({
        where: {
          phone,
        },
      });

    if (existingPhone) {
      return Response.json(
        {
          error:
            "Phone number already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password:
            hashedPassword,
        },
      });

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return Response.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}