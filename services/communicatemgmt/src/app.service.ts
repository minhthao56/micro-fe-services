import { Injectable } from '@nestjs/common';
import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    async function getServiceIPAndPort(serviceName: string, namespace: string) {
      const kubeConfig = new KubeConfig();
      kubeConfig.loadFromDefault();

      const apiClient = kubeConfig.makeApiClient(CoreV1Api);

      try {
        // Fetch the service object from Kubernetes API
        const response = await apiClient.readNamespacedService(
          serviceName,
          namespace,
        );

        console.log('response.body:', response.body);
        console.log('response.response:', response.response);
        console.log('response.statusCode.spec:', response.body.spec);
        return response;
        // Extract the service IP and port from the response
        // const serviceIP = response.body.spec?.clusterIP;
        // const servicePort = response.body.spec?.ports?.[0]?.port;

        // if (serviceIP && servicePort) {
        //   return `${serviceIP}:${servicePort}`;
        // } else {
        //   console.log(
        //     'Failed to retrieve IP and port information for the service.',
        //   );
        //   return null;
        // }
      } catch (error) {
        console.log('Error fetching service information:', error.message);
        return error;
      }
    }

    const serviceName = 'communicatemgmt-service';
    const namespace = 'default';

    // Call the function to get the service IP and port
    const serviceIPAndPort = await getServiceIPAndPort(serviceName, namespace);
    if (serviceIPAndPort) {
      console.log('Service IP and Port:', serviceIPAndPort);
      // Use the serviceIPAndPort to make the HTTP request to the service
    } else {
      console.log('Failed to get service IP and port.');
    }

    return 'Hello World!';
  }
}
