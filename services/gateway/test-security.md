# Security Testing Guide

## Quick Start

1. Start the gateway:
```bash
cd services/gateway
pnpm dev
```

2. The gateway will display security configuration on startup.

## Manual Testing

### 1. Test Rate Limiting

Open a terminal and run:

```bash
# Test basic query (should work)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status } }"}'

# Spam requests to trigger rate limit (101+ requests)
for i in {1..105}; do
  echo "Request $i"
  curl -X POST http://localhost:4000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health { status } }"}' \
    -w "\nHTTP Status: %{http_code}\n"
  sleep 0.1
done
```

Expected: After 100 requests, you should see `RATE_LIMIT_EXCEEDED` error.

### 2. Test Query Complexity (when user service is running)

```bash
# Low complexity query (should work)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status timestamp } }"}'
```

Check console output for complexity calculation.

### 3. Test Introspection (Production Mode)

```bash
# Start gateway in production mode
NODE_ENV=production pnpm dev

# Try introspection query
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

Expected: Should return `INTROSPECTION_DISABLED` error in production mode.

### 4. Check Rate Limit Headers

```bash
curl -v -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status } }"}' 2>&1 | grep -i "x-ratelimit"
```

Expected output:
```
< X-RateLimit-Limit: 100
< X-RateLimit-Remaining: 99
< X-RateLimit-Reset: <timestamp>
```

### 5. Test Large Request Rejection

```bash
# Create a very large query (>100KB)
python3 -c "
import json
import requests

# Create a huge variable payload
large_data = 'x' * 110000  # 110KB

query = {
    'query': '{ health { status } }',
    'variables': {'data': large_data}
}

response = requests.post(
    'http://localhost:4000/graphql',
    json=query,
    headers={'Content-Type': 'application/json'}
)

print(response.status_code)
print(response.json())
"
```

Expected: Should return `REQUEST_SIZE_LIMIT_EXCEEDED` error.

### 6. Test CORS (Different Origins)

```bash
# From allowed origin (should work)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"query":"{ health { status } }"}'

# From disallowed origin in production (should fail)
NODE_ENV=production curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Origin: http://malicious-site.com" \
  -d '{"query":"{ health { status } }"}'
```

## Automated Testing

Create a test script:

```bash
#!/bin/bash
# test-security.sh

GATEWAY_URL="http://localhost:4000/graphql"

echo "Testing GraphQL Gateway Security..."

# Test 1: Rate Limiting
echo -e "\n=== Test 1: Rate Limiting ==="
for i in {1..105}; do
  response=$(curl -s -X POST $GATEWAY_URL \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health { status } }"}')

  if echo "$response" | grep -q "RATE_LIMIT_EXCEEDED"; then
    echo "Rate limit triggered at request $i"
    break
  fi
done

# Wait for rate limit to reset
echo "Waiting for rate limit to reset..."
sleep 60

# Test 2: Health Check
echo -e "\n=== Test 2: Health Check ==="
curl -s -X POST $GATEWAY_URL \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status timestamp } }"}' | jq .

# Test 3: Introspection in Dev
echo -e "\n=== Test 3: Introspection (Development) ==="
curl -s -X POST $GATEWAY_URL \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { queryType { name } } }"}' | jq .

echo -e "\nSecurity tests completed!"
```

Make it executable:
```bash
chmod +x test-security.sh
./test-security.sh
```

## Expected Behavior

### Development Mode (NODE_ENV=development)
- Rate limiting: Enabled but lenient
- Introspection: Allowed
- CORS: All origins allowed
- Error details: Full stack traces
- Complexity logging: Console output

### Production Mode (NODE_ENV=production)
- Rate limiting: Strict enforcement
- Introspection: Blocked
- CORS: Strict whitelist
- Error details: Masked
- Complexity logging: Errors only

## Monitoring

Watch the gateway logs while testing:

```bash
# Terminal 1: Start gateway with logs
pnpm dev

# Terminal 2: Run tests
./test-security.sh
```

You should see:
- Security configuration on startup
- Rate limit warnings
- Complexity calculations
- Error logging
