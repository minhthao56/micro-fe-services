#!/bin/bash

while : ; do
    terminating_pods=$(kubectl get pods --field-selector=status.phase=Terminating --no-headers -o custom-columns=":metadata.name")

    if [ -z "$terminating_pods" ]; then
        echo "All pods with Terminating status have completed."
        break
    else
        echo "Waiting for the following pods to complete termination: $terminating_pods"
        sleep 5
    fi
done
