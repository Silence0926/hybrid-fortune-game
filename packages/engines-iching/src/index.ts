import type { IChingSessionRequest } from "@hybrid-fortune/domain";

export interface IChingCasting {
  method: IChingSessionRequest["method"];
  lines: null;
  status: "not_implemented";
  note: string;
}

/** Explicitly separate from the daily score engine. */
export function createIChingSession(request: IChingSessionRequest): IChingCasting {
  return {
    method: request.method,
    lines: null,
    status: "not_implemented",
    note: "Casting entropy source, line-generation rules, and text edition require approval."
  };
}
