/**
 * Quantum Flow OS - Client Integration SDK
 * 
 * A pluggable, premium client library enabling any developer to integrate
 * high-dimensional ethical ontology guardrails, cognitive alignment, and
 * self-constraining homeostasis protection into their AI applications.
 */

import * as http from 'http';

export interface SDKOptions {
  endpoint?: string;
  apiKey?: string;
  defaultEthicalMode?: 'strict' | 'relaxed' | 'permissive';
  defaultModel?: string;
}

export interface AlignmentResult {
  id: string;
  content: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class QuantumFlowSDK {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly defaultEthicalMode: string;
  private readonly defaultModel: string;

  constructor(options: SDKOptions = {}) {
    this.endpoint = options.endpoint || 'http://localhost:18081';
    this.apiKey = options.apiKey || 'qf-anonymous';
    this.defaultEthicalMode = options.defaultEthicalMode || 'strict';
    this.defaultModel = options.defaultModel || 'quantum-flow-ethical-oracle';
  }

  /**
   * Helper method to perform HTTP POST requests using native node libraries without external dependencies
   */
  private post(path: string, payload: any, headers: Record<string, string> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(path, this.endpoint);
        const requestData = JSON.stringify(payload);

        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Length': Buffer.byteLength(requestData),
            ...headers,
          },
        };

        const client = url.protocol === 'https:' ? require('https') : http;
        const req = client.request(options, (res: any) => {
          let responseBody = '';
          res.on('data', (chunk: string) => { responseBody += chunk; });
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(responseBody));
              } catch {
                resolve({ content: responseBody });
              }
            } else {
              reject(new Error(`Quantum Flow OS API returned status code ${res.statusCode}: ${responseBody}`));
            }
          });
        });

        req.on('error', (err: any) => reject(err));
        req.write(requestData);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Aligns a single raw prompt, running it through the 21 ethics engines and returning the response.
   */
  public async align(
    prompt: string,
    options: { model?: string; ethicalMode?: 'strict' | 'relaxed' | 'permissive'; sessionId?: string } = {}
  ): Promise<AlignmentResult> {
    const response = await this.post('/v1/chat/completions', {
      model: options.model || this.defaultModel,
      messages: [{ role: 'user', content: prompt }],
    }, {
      'x-ethical-mode': options.ethicalMode || this.defaultEthicalMode,
      'Authorization': `Bearer ${options.sessionId || this.apiKey}`,
    });

    return {
      id: response.id,
      content: response.choices[0].message.content,
      model: response.model,
      created: response.created,
      usage: response.usage,
    };
  }

  /**
   * Evaluates a full chat history and generates an ethically aligned completion.
   */
  public async alignChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options: { model?: string; ethicalMode?: 'strict' | 'relaxed' | 'permissive'; sessionId?: string } = {}
  ): Promise<AlignmentResult> {
    const response = await this.post('/v1/chat/completions', {
      model: options.model || this.defaultModel,
      messages,
    }, {
      'x-ethical-mode': options.ethicalMode || this.defaultEthicalMode,
      'Authorization': `Bearer ${options.sessionId || this.apiKey}`,
    });

    return {
      id: response.id,
      content: response.choices[0].message.content,
      model: response.model,
      created: response.created,
      usage: response.usage,
    };
  }

  /**
   * Drop-in Express middleware to automatically intercept and align cognitive payloads
   */
  public expressMiddleware() {
    return (req: any, res: any, next: any) => {
      // Intercept body and perform automatic alignment if applicable
      if (req.method === 'POST' && req.body && req.body.messages) {
        this.alignChat(req.body.messages, {
          model: req.body.model,
          ethicalMode: req.headers['x-ethical-mode'],
          sessionId: req.headers['authorization']?.replace('Bearer ', ''),
        })
          .then((result) => {
            req.quantumFlowAlignment = result;
            next();
          })
          .catch((err) => {
            res.status(500).json({
              error: `Quantum Flow OS Middleware interception failed: ${err.message}`,
            });
          });
      } else {
        next();
      }
    };
  }
}
