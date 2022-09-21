// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import * as postmark from "postmark";

type Data = {
  name: string;
};

type Error = {
  error_message: string;
};

const serverToken = process.env.POSTMARK_SERVER_TOKEN || "";
const client = new postmark.ServerClient(serverToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method === "POST") {
    try {
      await client.sendEmail({
        From: "hellosocks@stytch.com",
        To: "cal@stytch.com",
        Subject: "Your cart is waiting for you!",
        HtmlBody: "what do we got here",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error_message: "Something went wrong!" });
    }

    res.status(200).json({ name: serverToken });
  } else {
    res.status(404).json({ error_message: "Route not found." });
  }
}
