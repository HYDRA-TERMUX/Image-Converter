#!/bin/bash

# Automatic HTML/PHP Server with Hydra Logo

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hydra ASCII Art
HYDRA_LOGO="${RED}

██╗  ██╗██╗   ██╗██████╗ ██████╗  █████╗
██║  ██║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗
███████║ ╚████╔╝ ██║  ██║██████╔╝███████║
██╔══██║  ╚██╔╝  ██║  ██║██╔══██╗██╔══██║
██║  ██║   ██║   ██████╔╝██║  ██║██║  ██║
╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
${NC}
${GREEN}Automated HTML/PHP Server${NC}
${BLUE}    Coded by${NC}${RED} HYDRA TERMUX${NC}
"

# Configuration
PORT=8000
DOCUMENT_ROOT="./"
HTML_FILE="index.html"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Display Hydra logo and info
echo -e "$HYDRA_LOGO"
echo -e "${YELLOW}Starting server...${NC}"

start_server() {
    echo -e "${GREEN}Starting server on port ${YELLOW}$PORT${NC}"
    echo -e "${GREEN}Document root: ${YELLOW}$DOCUMENT_ROOT${NC}"
    echo -e "${GREEN}Opening ${BLUE}http://localhost:$PORT/$HTML_FILE ${GREEN}in your browser${NC}"
    echo -e "${RED}Press Ctrl+C to stop the server${NC}"

    # Open browser
    if command_exists xdg-open; then
        xdg-open "http://localhost:$PORT/$HTML_FILE" &
    elif command_exists open; then
        open "http://localhost:$PORT/$HTML_FILE" &
    else
        echo -e "${YELLOW}Could not auto-open browser. Please visit:${NC}"
        echo -e "${BLUE}http://localhost:$PORT/$HTML_FILE${NC}"
    fi

    # Start server
    if command_exists php; then
        php -S "localhost:$PORT" -t "$DOCUMENT_ROOT"
    elif command_exists python3; then
        python3 -m http.server "$PORT" --directory "$DOCUMENT_ROOT"
    elif command_exists python; then
        python -m SimpleHTTPServer "$PORT"
    else
        echo -e "${RED}Error: No server technology found (PHP or Python required)${NC}"
        exit 1
    fi
}

# Handle arguments
if [ "$#" -ge 1 ]; then HTML_FILE="$1"; fi
if [ "$#" -ge 2 ]; then PORT="$2"; fi
if [ "$#" -ge 3 ]; then DOCUMENT_ROOT="$3"; fi

start_server
