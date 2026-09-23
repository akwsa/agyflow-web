#!/usr/bin/env node
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

function parseJsonColumn(value) {
  if (Buffer.isBuffer(value)) {
    return JSON.parse(value.toString('utf-8'));
  }
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return value;
}

async function extractCheckpoints() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    const [rows] = await connection.query(`
      SELECT 
        run_id,
        graph_name,
        status,
        current_node,
        step,
        checkpoints,
        budget_used,
        created_at,
        end_time
      FROM orchestrator_runs 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`\n📊 Found ${rows.length} build runs:\n`);
    
    for (const row of rows) {
      const checkpoints = parseJsonColumn(row.checkpoints);
      const budgetUsed = parseJsonColumn(row.budget_used);
      
      console.log(`🆔 Run: ${row.run_id}`);
      console.log(`   Graph: ${row.graph_name}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Node: ${row.current_node} (step ${row.step})`);
      console.log(`   Checkpoints: ${checkpoints.length}`);
      console.log(`   Budget: ${budgetUsed.tokens} tokens, ${budgetUsed.toolCalls} calls`);
      console.log(`   Created: ${row.created_at}`);
      console.log(`   Duration: ${row.end_time ? Math.round((new Date(row.end_time) - new Date(row.created_at))/1000) + 's' : 'running'}`);
      
      // Extract code from checkpoints
      if (checkpoints.length > 0) {
        const outputDir = `./output/checkpoints/${row.run_id}`;
        fs.mkdirSync(outputDir, { recursive: true });
        
        checkpoints.forEach((checkpoint, idx) => {
          const filename = `${idx + 1}-${checkpoint.nodeId}.json`;
          fs.writeFileSync(
            path.join(outputDir, filename),
            JSON.stringify(checkpoint, null, 2)
          );
        });
        
        console.log(`   ✅ Exported to: ${outputDir}/`);
      }
      console.log('');
    }
    
    console.log('✨ Checkpoint extraction complete!');
    console.log('📁 Review files in ./output/checkpoints/ directory');
    
  } finally {
    await connection.end();
  }
}

extractCheckpoints().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
