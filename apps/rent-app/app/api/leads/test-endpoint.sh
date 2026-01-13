#!/bin/bash

# Test script for POST /api/leads endpoint

echo "Testing POST /api/leads endpoint..."
echo "-----------------------------------"

# Test 1: Valid request
echo -e "\n1. Testing valid lead creation..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "test-agent-001",
    "name": "Test Buyer",
    "email": "testbuyer@example.com",
    "phone": "555-123-4567",
    "message": "Looking for a 3BR home in Dallas",
    "timeline": "1-3 months",
    "budgetMin": 300000,
    "budgetMax": 500000
  }'

echo -e "\n\n2. Testing missing required field (no email)..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "test-agent-001",
    "name": "Test Buyer",
    "message": "Looking for a home"
  }'

echo -e "\n\n3. Testing invalid agent ID..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "invalid-agent-id",
    "name": "Test Buyer",
    "email": "testbuyer@example.com",
    "message": "Looking for a home"
  }'

echo -e "\n\n-----------------------------------"
echo "Tests complete!"
