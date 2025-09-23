"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomNumberGen = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class RandomNumberGen {
    constructor() {
        this.description = {
            displayName: 'True Random Numbers Generator',
            name: 'randomNumberGen',
            icon: 'file:random.svg',
            group: ['transform'],
            version: 1,
            description: 'Generates true random numbers based on atmospheric noise',
            defaults: {
                name: 'Random Number Generator',
            },
            usableAsTool: true,
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            requestDefaults: {
                baseURL: 'https://www.random.org',
                headers: {
                    'User-Agent': 'n8n-random-node/1.0.0',
                },
            },
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Generate Random Integer',
                            value: 'randomInt',
                            description: 'Generates a true random integer',
                            action: 'Generate a random integer',
                        },
                    ],
                    default: 'randomInt',
                },
                {
                    displayName: 'Minimum Value',
                    name: 'minValue',
                    type: 'number',
                    default: 1,
                    required: true,
                    description: 'The minimum value for the random integer (inclusive)',
                    displayOptions: {
                        show: {
                            operation: ['randomInt'],
                        },
                    },
                },
                {
                    displayName: 'Maximum Value',
                    name: 'maxValue',
                    type: 'number',
                    default: 100,
                    required: true,
                    description: 'The maximum value for the random integer (inclusive)',
                    displayOptions: {
                        show: {
                            operation: ['randomInt'],
                        },
                    },
                }
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            try {
                if (operation === 'randomInt') {
                    const minValue = this.getNodeParameter('minValue', i);
                    const maxValue = this.getNodeParameter('maxValue', i);
                    if (minValue >= maxValue) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Minimum Value must be less than Maximum Value', { itemIndex: i });
                    }
                    const url = `https://www.random.org/integers/?num=1&min=${minValue}&max=${maxValue}&col=1&base=10&format=plain&rnd=new`;
                    const options = {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'n8n-random-node/1.0.0',
                        }, timeout: 10000,
                    };
                    const response = await this.helpers.httpRequest({
                        ...options,
                        url,
                    });
                    if (!response || response.toString().trim() === '') {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response from random.org', { itemIndex: i });
                    }
                    const responseText = response.toString().trim();
                    const randomNumber = parseInt(responseText, 10);
                    if (isNaN(randomNumber)) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid response from random.org', { itemIndex: i });
                    }
                    const outputData = {
                        json: {
                            operation: 'randomInt',
                            minValue,
                            maxValue,
                            randomNumber,
                            timestamp: new Date().toISOString(),
                            source: 'Random.org',
                        },
                    };
                    returnData.push(outputData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            operation,
                            timestamp: new Date().toISOString(),
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.RandomNumberGen = RandomNumberGen;
//# sourceMappingURL=RandomNumberGen.node.js.map