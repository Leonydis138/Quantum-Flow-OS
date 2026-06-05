/**
 * Rawlsian Justice & Difference Principle Engine
 *
 * Implements John Rawls' theory of Justice as Fairness, including:
 * 1. The Principle of Equal Liberty (each observer has equal basic rights).
 * 2. The Difference Principle (systemic inequalities must work to the maximum
 *    benefit of the least-advantaged observers).
 * 3. The Veil of Ignorance Simulation (checking if an action is universally
 *    acceptable when the decision-maker's final identity is hidden).
 */

import { Action } from "./SelfConstrainingEngine";

export interface ObserverWelfare {
  observerId: string;
  name: string;
  primaryGoods: {
    rightsAndLiberties: number;    // 0.0 to 1.0 (Freedom of agency)
    opportunitiesAndAccess: number; // 0.0 to 1.0 (Resource access)
    powerAndInfluence: number;     // 0.0 to 1.0 (Decision weight)
    selfRespectBasis: number;      // 0.0 to 1.0 (Moral status/dignity)
  };
  totalWelfare: number;             // Aggregate index (0.0 to 4.0)
  isLeastAdvantaged: boolean;
}

export interface VeilOfIgnoranceResult {
  actionId: string;
  isUniversallyAcceptable: boolean;
  minPostWelfare: number;
  expectedWelfareUnderVeil: number;
  maximinImprovement: boolean; // Did welfare of the least advantaged improve?
  decisionMatrix: Array<{
    observerId: string;
    preWelfare: number;
    postWelfare: number;
    netChange: number;
  }>;
  message: string;
  timestamp?: Date;
}

export interface DistributionReport {
  timestamp: Date;
  giniIndex: number;          // 0.0 (perfect equality) to 1.0 (perfect inequality)
  maximinRatio: number;       // Ratio of min welfare to average welfare (0.0 to 1.0)
  leastAdvantagedObservers: string[];
  differencePrincipleSatisfied: boolean;
}

export class RawlsianJusticeEngine {
  private observersWelfare: Map<string, ObserverWelfare> = new Map();
  private reportsHistory: DistributionReport[] = [];
  private veilOfIgnoranceHistory: VeilOfIgnoranceResult[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Register or update an observer's welfare status in the Rawlsian space
   */
  public updateObserverWelfare(
    observerId: string,
    name: string,
    primaryGoods: Partial<ObserverWelfare["primaryGoods"]>,
  ): ObserverWelfare {
    const current = this.observersWelfare.get(observerId);

    const updatedGoods = {
      rightsAndLiberties: primaryGoods.rightsAndLiberties ?? current?.primaryGoods.rightsAndLiberties ?? 0.8,
      opportunitiesAndAccess: primaryGoods.opportunitiesAndAccess ?? current?.primaryGoods.opportunitiesAndAccess ?? 0.7,
      powerAndInfluence: primaryGoods.powerAndInfluence ?? current?.primaryGoods.powerAndInfluence ?? 0.5,
      selfRespectBasis: primaryGoods.selfRespectBasis ?? current?.primaryGoods.selfRespectBasis ?? 0.9,
    };

    const totalWelfare = parseFloat(
      (
        updatedGoods.rightsAndLiberties +
        updatedGoods.opportunitiesAndAccess +
        updatedGoods.powerAndInfluence +
        updatedGoods.selfRespectBasis
      ).toFixed(4),
    );

    const welfare: ObserverWelfare = {
      observerId,
      name,
      primaryGoods: updatedGoods,
      totalWelfare,
      isLeastAdvantaged: false, // will be recalculated
    };

    this.observersWelfare.set(observerId, welfare);
    this.recalculateLeastAdvantaged();

    return this.observersWelfare.get(observerId)!;
  }

  /**
   * Recalculate which observers belong to the least-advantaged group (bottom 25% or lowest welfare)
   */
  private recalculateLeastAdvantaged(): void {
    if (this.observersWelfare.size === 0) return;

    const sorted = Array.from(this.observersWelfare.values()).sort(
      (a, b) => a.totalWelfare - b.totalWelfare,
    );

    const minWelfare = sorted[0]!.totalWelfare;
    const threshold = minWelfare * 1.15; // Within 15% of absolute minimum

    for (const [, welfare] of this.observersWelfare) {
      welfare.isLeastAdvantaged = welfare.totalWelfare <= threshold;
    }
  }

  /**
   * Simulate action impact behind John Rawls' "Veil of Ignorance"
   */
  public simulateVeilOfIgnorance(
    action: Action,
    impactFunction: (obs: ObserverWelfare) => Partial<ObserverWelfare["primaryGoods"]>,
  ): VeilOfIgnoranceResult {
    const decisionMatrix: VeilOfIgnoranceResult["decisionMatrix"] = [];
    let minPostWelfare = Infinity;
    let totalPostWelfare = 0;

    let leastAdvantagedPreWelfare = Infinity;
    let leastAdvantagedPostWelfare = Infinity;

    // Identify current least advantaged welfare
    for (const welfare of this.observersWelfare.values()) {
      if (welfare.isLeastAdvantaged && welfare.totalWelfare < leastAdvantagedPreWelfare) {
        leastAdvantagedPreWelfare = welfare.totalWelfare;
      }
    }

    for (const welfare of this.observersWelfare.values()) {
      const simulatedGoodsDelta = impactFunction(welfare);
      
      const postGoods = {
        rightsAndLiberties: Math.max(
          0.0,
          Math.min(1.0, (simulatedGoodsDelta.rightsAndLiberties ?? 0) + welfare.primaryGoods.rightsAndLiberties),
        ),
        opportunitiesAndAccess: Math.max(
          0.0,
          Math.min(1.0, (simulatedGoodsDelta.opportunitiesAndAccess ?? 0) + welfare.primaryGoods.opportunitiesAndAccess),
        ),
        powerAndInfluence: Math.max(
          0.0,
          Math.min(1.0, (simulatedGoodsDelta.powerAndInfluence ?? 0) + welfare.primaryGoods.powerAndInfluence),
        ),
        selfRespectBasis: Math.max(
          0.0,
          Math.min(1.0, (simulatedGoodsDelta.selfRespectBasis ?? 0) + welfare.primaryGoods.selfRespectBasis),
        ),
      };

      const postWelfare = parseFloat(
        (
          postGoods.rightsAndLiberties +
          postGoods.opportunitiesAndAccess +
          postGoods.powerAndInfluence +
          postGoods.selfRespectBasis
        ).toFixed(4),
      );

      decisionMatrix.push({
        observerId: welfare.observerId,
        preWelfare: welfare.totalWelfare,
        postWelfare,
        netChange: parseFloat((postWelfare - welfare.totalWelfare).toFixed(4)),
      });

      if (postWelfare < minPostWelfare) {
        minPostWelfare = postWelfare;
      }

      if (welfare.isLeastAdvantaged && postWelfare < leastAdvantagedPostWelfare) {
        leastAdvantagedPostWelfare = postWelfare;
      }

      totalPostWelfare += postWelfare;
    }

    const expectedWelfareUnderVeil = parseFloat(
      (totalPostWelfare / (this.observersWelfare.size || 1)).toFixed(4),
    );

    // Difference Principle Rule: Any change must improve (or maintain) the welfare of the least advantaged group.
    const maximinImprovement =
      leastAdvantagedPostWelfare >= leastAdvantagedPreWelfare ||
      (leastAdvantagedPreWelfare === Infinity && minPostWelfare > 0);

    // Equal Liberty Rule: Basic rights & liberties must not drop below a critical threshold (e.g., 0.4) for anyone.
    const equalLibertyPreserved = decisionMatrix.every((entry) => {
      const obs = this.observersWelfare.get(entry.observerId)!;
      // Estimate post rights: pre + rightsDelta
      const delta = impactFunction(obs);
      const postRights = Math.max(
        0,
        Math.min(1, (delta.rightsAndLiberties ?? 0) + obs.primaryGoods.rightsAndLiberties),
      );
      return postRights >= 0.45;
    });

    const isUniversallyAcceptable = maximinImprovement && equalLibertyPreserved;

    let message = "";
    if (isUniversallyAcceptable) {
      message = "Veil of Ignorance test PASSED. Action satisfies Rawlsian Maximin; liberties and least advantaged welfare are protected.";
    } else {
      if (!equalLibertyPreserved) {
        message = "Veil of Ignorance test FAILED: Severe erosion of basic rights/liberties detected for one or more observers.";
      } else {
        message = "Veil of Ignorance test FAILED: Violates Difference Principle. Action reduces welfare of the least advantaged.";
      }
    }

    const result: VeilOfIgnoranceResult = {
      actionId: action.id,
      isUniversallyAcceptable,
      minPostWelfare,
      expectedWelfareUnderVeil,
      maximinImprovement,
      decisionMatrix,
      message,
      timestamp: new Date(),
    };

    this.veilOfIgnoranceHistory.unshift(result);
    if (this.veilOfIgnoranceHistory.length > this.maxHistorySize) {
      this.veilOfIgnoranceHistory.pop();
    }

    return result;
  }

  /**
   * Generate Rawlsian Distribution Report (Gini Coefficient & Maximin Ratio)
   */
  public generateDistributionReport(): DistributionReport {
    const welfareValues = Array.from(this.observersWelfare.values()).map(
      (o) => o.totalWelfare,
    );

    if (welfareValues.length === 0) {
      return {
        timestamp: new Date(),
        giniIndex: 0,
        maximinRatio: 1.0,
        leastAdvantagedObservers: [],
        differencePrincipleSatisfied: true,
      };
    }

    // Gini Coefficient calculation
    let absoluteDifferencesSum = 0;
    for (let i = 0; i < welfareValues.length; i++) {
      for (let j = 0; j < welfareValues.length; j++) {
        absoluteDifferencesSum += Math.abs(welfareValues[i]! - welfareValues[j]!);
      }
    }

    const n = welfareValues.length;
    const avgWelfare = welfareValues.reduce((sum, w) => sum + w, 0) / n;
    const giniIndex =
      avgWelfare > 0
        ? parseFloat((absoluteDifferencesSum / (2 * n * n * avgWelfare)).toFixed(4))
        : 0;

    const minWelfare = Math.min(...welfareValues);
    const maximinRatio =
      avgWelfare > 0 ? parseFloat((minWelfare / avgWelfare).toFixed(4)) : 1.0;

    const leastAdvantaged = Array.from(this.observersWelfare.values())
      .filter((o) => o.isLeastAdvantaged)
      .map((o) => o.name);

    // Difference Principle holds if we have a healthy distribution balance (Gini <= 0.35 or Maximin ratio is reasonable)
    const differencePrincipleSatisfied = maximinRatio >= 0.5 && giniIndex <= 0.35;

    const report: DistributionReport = {
      timestamp: new Date(),
      giniIndex,
      maximinRatio,
      leastAdvantagedObservers: leastAdvantaged,
      differencePrincipleSatisfied,
    };

    this.reportsHistory.push(report);
    if (this.reportsHistory.length > this.maxHistorySize) {
      this.reportsHistory.shift();
    }

    return report;
  }

  /**
   * Get all observer welfare values
   */
  public getAllObserverWelfares(): ObserverWelfare[] {
    return Array.from(this.observersWelfare.values());
  }

  /**
   * Get historical reports
   */
  public getReportsHistory(): DistributionReport[] {
    return [...this.reportsHistory];
  }

  /**
   * Get history of Veil of Ignorance simulations
   */
  public getVeilHistory(): VeilOfIgnoranceResult[] {
    return [...this.veilOfIgnoranceHistory];
  }
}
