# Hello Socks Demo

This is a [Next.js](https://nextjs.org/) e-commerce demo application showcasing authentication with [Stytch](https://stytch.com/), featuring adaptive MFA, device fingerprinting, and MCP (Model Context Protocol) integration.

## Prerequisites

Before running this application, you'll need:

1. **Stytch Account**: Create a project at [stytch.com](https://stytch.com/)
2. **Environment Variables**: Configure the required environment variables (see below)
3. **Stytch Configuration**: Set up redirect URLs in your Stytch dashboard

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Stytch Configuration
STYTCH_PROJECT_ID=your_stytch_project_id
STYTCH_PROJECT_SECRET=your_stytch_project_secret
STYTCH_DOMAIN=your_stytch_domain
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=your_stytch_public_token
```

## Stytch Dashboard Configuration

In your Stytch dashboard, configure the following redirect URLs:

### OAuth Redirect URLs
- **Login Redirect URL**: `http://localhost:3000/fraud/fingerprint`
- **Signup Redirect URL**: `http://localhost:3000/fraud/fingerprint`

### Magic Link Redirect URLs
- **Login Magic Link URL**: `http://localhost:3000/fraud/fingerprint`
- **Signup Magic Link URL**: `http://localhost:3000/fraud/fingerprint`

### Additional Configuration
- Enable **Google OAuth** in your Stytch OAuth settings
- Configure **Fraud & Risk** settings to enable device fingerprinting
- Set up **Email Templates** for magic links and order confirmations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Features

- **Authentication**: Magic links, Google OAuth, and SMS OTP via Stytch
- **Adaptive MFA**: Device fingerprinting determines if 2FA is required
- **Order Management**: Place and confirm sock orders with email notifications
- **MCP Integration**: AI-accessible tools for order management

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
