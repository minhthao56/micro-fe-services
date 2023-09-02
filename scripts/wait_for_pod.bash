#!/bin/bash
NAMESPACE="default"

# Function to get the name of the PostgreSQL pod
get_postgresql_pod_name() {
  kubectl get pods -n "$NAMESPACE" | grep 'postgresql-' | awk '{print $1}'
}

# Function to check if the specified pod is in the "Running" state
is_pod_running() {
  local pod_name="$1"
  local namespace="$2"
  local pod_status=$(kubectl get pod "$pod_name" -n "$namespace" -o jsonpath='{.status.phase}')
  [ "$pod_status" == "Running" ]
}

# Wait for the PostgreSQL pod to be in the "Running" state
wait_for_postgresql() {
  local retries=30
  local delay=10

  for ((i = 0; i < retries; i++)); do
    local postgresql_pod=$(get_postgresql_pod_name)
    if [ -n "$postgresql_pod" ] && is_pod_running "$postgresql_pod" "$NAMESPACE"; then
      echo "PostgreSQL pod $postgresql_pod is now Running"
      return 0
    fi
    echo "Waiting for PostgreSQL pod to be Running..."
    sleep "$delay"
  done

  echo "Timed out waiting for PostgreSQL pod to be Running"
  exit 1
}

wait_for_postgresql