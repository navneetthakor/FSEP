// creating express router object
const express = require('express');
const router = express.Router();

const fetchUser = require("../Middelwares/fetchUser.middelware");
const axios = require("axios");

// Route to fetch metrics based on instance ID
router.get('/serverGraph/:jobId', fetchUser, async (req, res) => {
    try {

        const instanceId = req.user.id;

        const { jobId } = req.params;
        const { start, end } = req.query;


        // Fetch CPU usage data
        const cpuQuery = `http_Gauge_response_time_custom`;
        const resTimeData = await fetchPrometheusData(cpuQuery, start, end);

        // Fetch memory usage data
        const memoryQuery = `http_status_code_custom{instance_id="${instanceId}",}`;
        const statusCodeData = await fetchPrometheusData(memoryQuery, start, end);

        res.json({
            instanceId,
            metrics: {
                resTimeData: formatMetricData(resTimeData),
                statusCodeData: formatMetricData(statusCodeData)
            }
        });
    } catch (error) {
        console.error('Error fetching instance metrics:', error);
        res.status(500).json({ error: 'Failed to fetch instance metrics' });
    }
});


// Function to fetch data from Prometheus API in Grafana Cloud
async function fetchPrometheusData(query, start, end) {
    // Grafana Cloud API configuration
    const GRAFANA_URL = process.env.GRAFANA_URL;
    const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY;

    // const startTime = start || (Math.floor(Date.now() / 1000) - 3600000); // Default to last hour
    // const endTime = end || Math.floor(Date.now() / 1000) - 360000;
    const now = Math.floor(Date.now() / 1000);
    const startTime = start || (now - 172800); // Default to 48 hours ago
    const endTime = end || now;                // Default to current time


    const response = await axios.get(`${GRAFANA_URL}/api/datasources/proxy/9/api/v1/query_range`, {
        params: {
            query,
            start: startTime,
            end: endTime,
            step: '60s' // 1 minute intervals
        },
        headers: {
            'Authorization': `Bearer ${GRAFANA_API_KEY}`
        }
    });

    console.log(response.data);

    return response.data;
}

// Format the metric data for frontend consumption
function formatMetricData(prometheusData) {
    if (!prometheusData.data || !prometheusData.data.result || prometheusData.data.result.length === 0) {
        return [];
    }

    return prometheusData.data.result.map(result => {
        const { metric, values } = result;

        return {
            metric: metric,
            values: values.map(([timestamp, value]) => ({
                timestamp: timestamp * 1000, // Convert to milliseconds for JS
                value: parseFloat(value)
            }))
        };
    });
}

module.exports = router;


// POST https://<your_grafana_subdomain>.grafana.net/api/ds/query
// Headers:
//   Authorization: Bearer <API_KEY>
//   Content-Type: application/json

// Body:
// {
//   "queries": [
//     {
//       "refId": "A",
//       "datasource": { "type": "prometheus", "uid": "<DATASOURCE_UID>" },
//       "expr": "up",
//       "intervalMs": 1000,
//       "maxDataPoints": 500
//     }
//   ],
//   "range": {
//     "from": "2025-05-01T00:00:00Z",
//     "to": "2025-05-02T00:00:00Z"
//   }
// }
