export const LinkedInApi = {
  CLIENT_ID: "86bmj5hgj05pbm", // Update with your CLIENT_ID
  CLIENT_SECRET: "SLqhmywaNKgICBMw",
  redirectUrl: "http://localhost:3000/linkedin/redirect", // Update with your REDIRECT_URL
  REDIRECT_URI: "http://localhost:3000/linkedin/redirect",
  oauthUrl: "http://localhost:5000/api/linkedin/authorize",
  SCOPE: "openid profile email", // Update with your desired scope
};

export const NodeServer = {
  baseURL: "http://localhost:5000",
  getUserCredentials: "http://localhost:5000/api/linkedin/redirect",
};
