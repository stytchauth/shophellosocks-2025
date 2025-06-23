import * as stytch from 'stytch';

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID || '',
  secret: process.env.STYTCH_PROJECT_SECRET || '',
  custom_base_url: process.env.STYTCH_DOMAIN,
});

export default client;
