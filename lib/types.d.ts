declare global {
  function GetTelemetryID(params: { publicToken: string }): Promise<string>;
}

export {};
