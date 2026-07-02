export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { message: "Newsletter is not configured yet." },
        { status: 500 }
      );
    }

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        groups: [],
      }),
    });

    if (!response.ok) {
      return Response.json(
        { message: "Could not subscribe. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({
      message: "You are now subscribed.",
    });
  } catch {
    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
