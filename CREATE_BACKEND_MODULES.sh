#!/bin/bash

# Script to create all backend modules at once
# This speeds up development significantly

BASE_DIR="/home/claude/iptegra-nexus-full/backend/src/modules"

echo "Creating backend modules..."

# Create all module directories
mkdir -p $BASE_DIR/{auth,users,requests,assignments,okrs,products,clients,metrics,notifications}

echo "✓ Module directories created"
echo "Now creating module files..."

