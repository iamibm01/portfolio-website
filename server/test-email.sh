#!/bin/bash
set -e

BASE="http://localhost:3001"
PASS=0
FAIL=0

check() {
  local label="$1"
  local response="$2"
  local expected="$3"
  if echo "$response" | grep -q "$expected"; then
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $label — got: $response"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Chat endpoint ==="

# 1. Rejects empty messages
r=$(curl -s -X POST "$BASE/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}')
check "rejects empty messages array" "$r" "error"

# 2. Returns a reply for a valid message
r=$(curl -s -X POST "$BASE/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}]}')
check "returns AI reply" "$r" "reply"

echo ""
echo "=== Lead endpoint ==="

# 3. Rejects missing name
r=$(curl -s -X POST "$BASE/api/send-lead" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","conversationSummary":"..."}')
check "rejects missing name" "$r" "error"

# 4. Rejects malformed email
r=$(curl -s -X POST "$BASE/api/send-lead" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"not-an-email","conversationSummary":"..."}')
check "rejects malformed email" "$r" "error"

# 5. Sends both emails with valid payload
r=$(curl -s -X POST "$BASE/api/send-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Visitor",
    "email": "muhammadibraheem177@gmail.com",
    "conversationSummary": "[ASSISTANT]: What is your name?\n\n[USER]: Test Visitor\n\n[ASSISTANT]: What email can I reach you at?\n\n[USER]: muhammadibraheem177@gmail.com"
  }')
check "sends emails successfully" "$r" "success"

# 6. Rejects XSS attempt (should sanitize, not crash)
r=$(curl -s -X POST "$BASE/api/send-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(1)</script>",
    "email": "muhammadibraheem177@gmail.com",
    "conversationSummary": "<img src=x onerror=alert(1)>"
  }')
check "handles HTML in name without crashing" "$r" "success"

echo ""
echo "Results: $PASS passed, $FAIL failed"
echo ""
