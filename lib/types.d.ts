declare global {
  async function GetTelemetryID(publicToken: string): Promise<string>;
}