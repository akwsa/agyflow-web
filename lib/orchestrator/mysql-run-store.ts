import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

import type { RunState } from './graph';

type RunRow = RowDataPacket & {
  run_id: string;
  graph_name: string;
  status: RunState['status'];
  current_node: string;
  step: number;
  start_time: Date;
  end_time: Date | null;
  budget_used: string | RunState['budgetUsed'];
  checkpoints: string | RunState['checkpoints'];
  error: string | null;
};

function parseJson<T>(value: string | T): T {
  return typeof value === 'string' ? JSON.parse(value) as T : value;
}

export class MySqlRunStore {
  private readonly pool: Pool;

  constructor(databaseUrl: string) {
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required for MySQL run persistence');
    }
    this.pool = mysql.createPool(databaseUrl);
  }

  async initialize(): Promise<void> {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS orchestrator_runs (
        run_id VARCHAR(191) PRIMARY KEY,
        graph_name VARCHAR(191) NOT NULL,
        status VARCHAR(32) NOT NULL,
        current_node VARCHAR(191) NOT NULL,
        step INT NOT NULL DEFAULT 0,
        start_time DATETIME(3) NOT NULL,
        end_time DATETIME(3) NULL,
        budget_used JSON NOT NULL,
        checkpoints JSON NOT NULL,
        error TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orchestrator_runs_status (status),
        INDEX idx_orchestrator_runs_updated_at (updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async save(state: RunState): Promise<void> {
    await this.pool.execute(
      `INSERT INTO orchestrator_runs (
        run_id, graph_name, status, current_node, step, start_time, end_time,
        budget_used, checkpoints, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        graph_name = VALUES(graph_name),
        status = VALUES(status),
        current_node = VALUES(current_node),
        step = VALUES(step),
        start_time = VALUES(start_time),
        end_time = VALUES(end_time),
        budget_used = VALUES(budget_used),
        checkpoints = VALUES(checkpoints),
        error = VALUES(error)`,
      [
        state.runId,
        state.graphName,
        state.status,
        state.currentNode,
        state.step,
        state.startTime,
        state.endTime ?? null,
        JSON.stringify(state.budgetUsed),
        JSON.stringify(state.checkpoints),
        state.error ?? null,
      ],
    );
  }

  async get(runId: string): Promise<RunState | null> {
    const [rows] = await this.pool.execute<RunRow[]>(
      'SELECT * FROM orchestrator_runs WHERE run_id = ? LIMIT 1',
      [runId],
    );
    const row = rows[0];
    if (!row) {
      return null;
    }

    const checkpoints = parseJson<RunState['checkpoints']>(row.checkpoints).map(checkpoint => ({
      ...checkpoint,
      timestamp: new Date(checkpoint.timestamp),
    }));

    return {
      runId: row.run_id,
      graphName: row.graph_name,
      status: row.status,
      currentNode: row.current_node,
      step: row.step,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      budgetUsed: parseJson<RunState['budgetUsed']>(row.budget_used),
      checkpoints,
      error: row.error ?? undefined,
    };
  }

  async delete(runId: string): Promise<void> {
    await this.pool.execute('DELETE FROM orchestrator_runs WHERE run_id = ?', [runId]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
