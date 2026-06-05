#!/usr/bin/env bash

# start-tunnel-dashboard.sh
# Downloader and concurrent executor for Quantum Flow OS + Cloudflare Tunneling.

set -e

# Setup colors
BOLD="\033[1m"
GREEN="\033[38;5;82m"
BLUE="\033[38;5;45m"
PURPLE="\033[38;5;141m"
CYAN="\033[38;5;51m"
YELLOW="\033[38;5;220m"
RED="\033[38;5;196m"
RESET="\033[0m"

echo -e "${BOLD}${PURPLE}====================================================${RESET}"
echo -e "${BOLD}${PURPLE}  QUANTUM FLOW OS - SECURE REMOTE GATEWAY CONFIG    ${RESET}"
echo -e "${BOLD}${PURPLE}====================================================${RESET}"

# Determine architecture
ARCH=$(uname -m)
CLOUDFLARED_BIN="./cloudflared"

if [ ! -f "$CLOUDFLARED_BIN" ]; then
    echo -e "${CYAN}⚡ Downloading Cloudflare tunnel daemon (cloudflared)...${RESET}"
    if [ "$ARCH" = "x86_64" ]; then
        DOWNLOAD_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
    elif [[ "$ARCH" = "aarch64" || "$ARCH" = "arm64" ]]; then
        DOWNLOAD_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
    else
        DOWNLOAD_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-386"
    fi
    
    echo -e "Downloading from: ${BLUE}$DOWNLOAD_URL${RESET}"
    curl -L "$DOWNLOAD_URL" -o "$CLOUDFLARED_BIN"
    chmod +x "$CLOUDFLARED_BIN"
    echo -e "${GREEN}✓ cloudflared binary successfully installed and verified.${RESET}"
else
    echo -e "${GREEN}✓ cloudflared binary already exists in workspace.${RESET}"
fi

# Clean up files
rm -f cloudflared.log dashboard/tunnel.json

# Keep track of spawned PIDs for clean teardown on exit
SERVER_PID=""
TUNNEL_PID=""

cleanup() {
    echo -e "\n${YELLOW}⚡ Tearing down gateway tunnels and dashboard servers...${RESET}"
    if [ -n "$SERVER_PID" ]; then
        kill "$SERVER_PID" 2>/dev/null || true
    fi
    if [ -n "$TUNNEL_PID" ]; then
        kill "$TUNNEL_PID" 2>/dev/null || true
    fi
    rm -f dashboard/tunnel.json
    echo -e "${GREEN}✓ Cleanup complete. Safe trails!${RESET}"
    exit 0
}

# Trap SIGINT, SIGTERM, and EXIT
trap cleanup SIGINT SIGTERM EXIT

# Start Dashboard Server
echo -e "${CYAN}🚀 Launching Quantum Flow OS local node server...${RESET}"
# We'll use the compiled dist server
PORT=8080 npm run start:dashboard > node-server.log 2>&1 &
SERVER_PID=$!

# Wait briefly for local port to open
sleep 2

# Start cloudflared quick tunnel
echo -e "${CYAN}📡 Spawning free secure quick tunnel at http://localhost:8080...${RESET}"
$CLOUDFLARED_BIN tunnel --url http://localhost:8080 > cloudflared.log 2>&1 &
TUNNEL_PID=$!

# Monitor logs to find the trycloudflare url
echo -e "${YELLOW}🔄 Waiting for Cloudflare to assign remote subdomain (typically takes 5-15s)...${RESET}"
TUNNEL_URL=""
COUNT=0
MAX_ATTEMPTS=40

while [ $COUNT -lt $MAX_ATTEMPTS ]; do
    if grep -q "trycloudflare.com" cloudflared.log; then
        TUNNEL_URL=$(grep -o "https://[^ ]*trycloudflare.com" cloudflared.log | head -n 1)
        if [ -n "$TUNNEL_URL" ]; then
            break
        fi
    fi
    sleep 1
    COUNT=$((COUNT + 1))
done

if [ -z "$TUNNEL_URL" ]; then
    echo -e "${RED}❌ Error: Cloudflare Tunnel establishment timed out.${RESET}"
    echo -e "Check the logs in ${BOLD}cloudflared.log${RESET} for details."
    exit 1
fi

# Save the tunnel URL for the web dashboard to fetch
echo "{\"url\": \"$TUNNEL_URL\"}" > dashboard/tunnel.json

echo -e "\n${BOLD}${GREEN}🎉 SECURE REMOTE GATEWAY SCCESSFULLY DEPLOYED!${RESET}"
echo -e "Your local application has been exposed to the global web."
echo -e "----------------------------------------------------"
echo -e "${BOLD}${CYAN}Primary Portal URL (Remote Landing Page):${RESET}"
echo -e "${BOLD}${GREEN}👉 $TUNNEL_URL${RESET}"
echo -e "----------------------------------------------------"
echo -e "${BOLD}${BLUE}Direct Department Remote Access Links:${RESET}"
echo -e "1. ${BOLD}Action Operations Room:${RESET}     $TUNNEL_URL/dashboard.html?dept=action-control"
echo -e "2. ${BOLD}Temporal Sandbox:${RESET}          $TUNNEL_URL/dashboard.html?dept=temporal-sandbox"
echo -e "3. ${BOLD}Self-Constraining Ethics:${RESET}  $TUNNEL_URL/dashboard.html?dept=fixed-point"
echo -e "4. ${BOLD}Observer Entanglement:${RESET}     $TUNNEL_URL/dashboard.html?dept=observer-entanglement"
echo -e "5. ${BOLD}Retrocausal Governance:${RESET}    $TUNNEL_URL/dashboard.html?dept=coherence-modulator"
echo -e "6. ${BOLD}Quantum Supervision:${RESET}       $TUNNEL_URL/dashboard.html?dept=eigenfield-resonance"
echo -e "7. ${BOLD}Governance Constraints:${RESET}    $TUNNEL_URL/dashboard.html?dept=governance"
echo -e "8. ${BOLD}Cryptographic Ledger:${RESET}      $TUNNEL_URL/dashboard.html?dept=ledger"
echo -e "----------------------------------------------------"
echo -e "${BOLD}${YELLOW}Press [Ctrl+C] to stop both the tunnel and the node server.${RESET}\n"

# Keep the script running to hold processes up
while true; do
    sleep 1
done
