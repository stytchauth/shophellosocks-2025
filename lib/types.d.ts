declare global {
  function GetTelemetryID(params: { publicToken: string, submitURL: string }): Promise<string>;
}

export {};
