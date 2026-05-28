/**
 * Tests for Cryptographic Ethical Ledger Subsystem
 */

import { EthicalLedger } from '../src/core/EthicalLedger';

describe('EthicalLedger', () => {
  let ledger: EthicalLedger;

  beforeEach(() => {
    ledger = new EthicalLedger();
  });

  describe('Genesis Block', () => {
    it('should initialize with a single genesis block', () => {
      const chain = ledger.getChain();
      expect(chain).toHaveLength(1);
      
      const genesis = chain[0]!;
      expect(genesis.index).toBe(0);
      expect(genesis.type).toBe('genesis');
      expect(genesis.previousHash).toBe('0'.repeat(64));
      expect(genesis.hash).not.toBe('');
    });
  });

  describe('Ledger Chaining & Append', () => {
    it('should append actions, constraints, and violations to create a chain', () => {
      ledger.append('constraint', { id: 'c1', type: 'observer_protection' });
      ledger.append('action', { id: 'a1', type: 'create_feature', description: 'benign' });
      ledger.append('violation', { id: 'v1', severity: 8 });

      const chain = ledger.getChain();
      expect(chain).toHaveLength(4); // 1 genesis + 3 appended

      // Verify indexing
      expect(chain[1]!.index).toBe(1);
      expect(chain[2]!.index).toBe(2);
      expect(chain[3]!.index).toBe(3);

      // Verify cryptographic link
      expect(chain[1]!.previousHash).toBe(chain[0]!.hash);
      expect(chain[2]!.previousHash).toBe(chain[1]!.hash);
      expect(chain[3]!.previousHash).toBe(chain[2]!.hash);
    });
  });

  describe('Cryptographic Integrity Verification', () => {
    it('should verify the integrity of an untampered ledger', () => {
      ledger.append('constraint', { id: 'c1' });
      ledger.append('action', { id: 'a1' });
      
      expect(ledger.verifyIntegrity()).toBe(true);
    });

    it('should detect unauthorized tampering and return false during verification', () => {
      ledger.append('constraint', { id: 'c1' });
      ledger.append('action', { id: 'a1' });

      expect(ledger.verifyIntegrity()).toBe(true);

      // Perform a simulated tampering of block #1 data
      ledger.tamperWithEntry(1, { id: 'TAMPERED_CONSTRAINT' });

      // Verification must now fail!
      expect(ledger.verifyIntegrity()).toBe(false);
    });
  });
});
