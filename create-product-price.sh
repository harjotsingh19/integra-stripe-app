#!/bin/bash

# Base URL for your API
BASE_URL="http://localhost:7000/product/"

# Function to create a plan
create_plan() {
  local name="$1"
  local description="$2"
  local amount="$3"
  local period="$4"

  echo "Creating plan: $name"

  curl -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "'"$name"'",
      "description": "'"$description"'",
      "amount": '"$amount"',
      "period": "'"$period"'"
    }'
  
  echo ""
}

# Creating all plans
create_plan "Personal" "Access to Personal Plan with monthly and annual billing options" 25 "month"
create_plan "Personal" "Access to Personal Plan with monthly and annual billing options" 15 "year"
create_plan "Standard" "Access to Standard Plan with monthly and annual billing options" 60 "month"
create_plan "Standard" "Access to Standard Plan with monthly and annual billing options" 40 "year"
create_plan "Pro" "Access to Pro Plan with monthly and annual billing options" 100 "month"
create_plan "Pro" "Access to Pro Plan with monthly and annual billing options" 75 "year"
create_plan "Enterprise" "Access to Enterprise Plan with custom billing options" 0 "month" # Custom pricing to be handled separately

echo "All plans have been created."
