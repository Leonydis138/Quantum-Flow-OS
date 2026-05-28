/**
 * Cryptographic Ethical Ledger Subsystem
 * 
 * Implements an immutable, cryptographically-chained ledger for actions,
 * constraints, and violations, ensuring tamper-proof audit trails.
 */

import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface LedgerEntry<T = unknown> {
  index: number;
  id: string;
  timestamp: Date;
  type: 'action' | 'violation' | 'constraint' | 'genesis';
  data: T;
  previousHash: string;
  hash: string;
}

export class EthicalLedger {
  private chain: LedgerEntry[];

  constructor() {
    this.chain = [];
    this.createGenesisEntry();
  }

  /**
   * Create the initial genesis block entry
   */
  private createGenesisEntry(): void {
    const genesisEntry: LedgerEntry<string> = {
      index: 0,
      id: uuidv4(),
      timestamp: new Date(),
      type: 'genesis',
      data: 'Quantum Flow OS Ethical Ledger Genesis Block',
      previousHash: '0'.repeat(64),
      hash: '',
    };

    genesisEntry.hash = this.calculateHash(genesisEntry);
    this.chain.push(genesisEntry);
  }

  /**
   * Calculate SHA-256 hash for a given ledger entry
   */
  public calculateHash(entry: Omit<LedgerEntry, 'hash'>): string {
    const dataString = typeof entry.data === 'string' 
      ? entry.data 
      : JSON.stringify(entry.data);

    const stringToHash = 
      entry.index + 
      entry.id + 
      entry.timestamp.getTime() + 
      entry.type + 
      dataString + 
      entry.previousHash;

    return createHash('sha256').update(stringToHash).digest('hex');
  }

  /**
   * Append a new entry to the immutable ledger
   */
  public append<T>(
    type: 'action' | 'violation' | 'constraint',
    data: T
  ): LedgerEntry<T> {
    const lastEntry = this.chain[this.chain.length - 1]!;
    
    const entry: Omit<LedgerEntry<T>, 'hash'> = {
      index: lastEntry.index + 1,
      id: uuidv4(),
      timestamp: new Date(),
      type,
      data,
      previousHash: lastEntry.hash,
    };

    const hashedEntry: LedgerEntry<T> = {
      ...entry,
      hash: this.calculateHash(entry),
    };

    this.chain.push(hashedEntry as LedgerEntry);
    return hashedEntry;
  }

  /**
   * Return the complete ledger chain
   */
  public getChain(): LedgerEntry[] {
    return [...this.chain];
  }

  /**
   * Verify the integrity of the ledger chain
   * Returns true if the ledger is valid and hasn't been tampered with
   */
  public verifyIntegrity(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i]!;
      const previous = this.chain[i - 1]!;

      // 1. Recalculate hash of current block
      const recalculatedHash = this.calculateHash(current);
      if (current.hash !== recalculatedHash) {
        console.error(`Ledger Integrity Violation: Block #${current.index} hash mismatch`);
        return false;
      }

      // 2. Compare previousHash to preceding block's hash
      if (current.previousHash !== previous.hash) {
        console.error(`Ledger Integrity Violation: Block #${current.index} previousHash link broken`);
        return false;
      }
    }

    return true;
  }

  /**
   * Attempt to modify a block (to test integrity verification)
   * This is explicitly added for demonstration and testing of integrity controls
   */
  public tamperWithEntry(index: number, modifiedData: any): boolean {
    if (index <= 0 || index >= this.chain.length) {
      return false; // Cannot tamper with genesis block easily or out of bounds indices
    }

    const target = this.chain[index]!;
    target.data = modifiedData;
    // Note: We don't recalculate the hash, causing verification to fail on next run!
    return true;
  }
}
