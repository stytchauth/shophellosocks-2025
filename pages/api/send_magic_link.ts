// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import * as postmark from "postmark";
import { getDomainFromRequest } from "../../lib/urlUtils";
import loadStytch from "../../lib/stytchClient";

type Data = {
  message: string;
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
    if (req.cookies["stytch_session"]) {
      try {
        const stytchClient = loadStytch();
        const resp = await stytchClient.sessions.authenticate({
          session_token: req.cookies["stytch_session"],
        });

        const { token } = await stytchClient.magicLinks.create({
          user_id: resp.user.user_id,
        });

        await client.sendEmailWithTemplate({
          From: "Hello Socks <hellosocks@stytch.com>",
          To: resp.user.emails[0].email,
          TemplateAlias: "welcome",
          TemplateModel: {
            url: `${getDomainFromRequest(req)}/cart?token=${token}`,
          },
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error_message: "Something went wrong!" });
      }
    } else {
      res.status(404).json({ error_message: "No user session found." });
    }
    res.status(200).json({ message: "email sent!" });
  } else {
    res.status(404).json({ error_message: "Route not found." });
  }
}
