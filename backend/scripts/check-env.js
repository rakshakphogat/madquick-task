#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Checks if all required environment variables are set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV'
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('Required variables:');
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    hasErrors = true;
  }
});

// Check optional variables
console.log('\nOptional variables:');
optionalEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set (${process.env[varName]})`);
  } else {
    console.log(`⚠️  ${varName}: Not set (will use default)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Environment validation failed!');
  console.log('Please set the missing environment variables in your .env file.');
  console.log('See .env.example for reference.');
  process.exit(1);
} else {
  console.log('✅ Environment validation passed!');
  console.log('All required environment variables are set.');
}