export interface EthicalAction {
  id?: string;
  intent: string;
  [key: string]: unknown;
}

export interface EthicalViolation {
  type: string;
  message: string;
  critical: boolean;
}

export class KantianObserverProtection {
  evaluate(action: EthicalAction): EthicalViolation[] {
    const violations: EthicalViolation[] = [];
    const intent = action.intent.toLowerCase();
    if (intent.includes("dehumanize") || intent.includes("instrumentalize")) {
      violations.push({
        type: "observer_protection",
        message: "Kantian protection violation: observer treated as means only",
        critical: true,
      });
    }
    return violations;
  }
}
