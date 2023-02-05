import axios from 'axios';

// docs: https://kafka.js.org/docs/configuration#broker-discovery
export function kafkaBrokersConfig(kafkaServerUrl: string) {
  return async function () {
    const clusterResponse = await axios.get(`${kafkaServerUrl}/v3/clusters`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    });

    const clusterUrl = clusterResponse.data.data[0].links.self

    const brokersResponse = await axios.get(`${clusterUrl}/brokers`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    });

    const brokers = brokersResponse.data.data.map(broker => {
      const { host, port } = broker.attributes
      return `${host}:${port}`
    })

    return brokers
  }
}
