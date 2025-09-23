// https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/#step-3-define-the-node-in-the-base-file
// importações necessárias do n8n   
import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import {NodeOperationError} from 'n8n-workflow';

// classe principal
export class RandomNumberGen implements INodeType {
    // descrição do nó
    description: INodeTypeDescription = {
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
            headers:{
                'User-Agent': 'n8n-random-node/1.0.0',

            },
        },
        // configuração das propriedades do nó
        properties: [
            // ----------------------------------
            //         Operation
            // ----------------------------------
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
            // ----------------------------------
            //         minValue
            // ----------------------------------
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
            // ----------------------------------
            //         maxValue
            // ----------------------------------
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
    
    // lógica de execução do nó
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>{
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = []; // array para armazenar os dados de saída
        
        for (let i = 0; i < items.length; i++){
            const operation = this.getNodeParameter('operation', i) as string;
            try{
                if(operation === 'randomInt'){
                    const minValue = this.getNodeParameter('minValue', i) as number;
                    const maxValue = this.getNodeParameter('maxValue', i) as number;

                    // valor mínimo deve ser menor que o valor máximo
                    if(minValue >= maxValue){
                        throw new NodeOperationError(
                            this.getNode(), 'Minimum Value must be less than Maximum Value', { itemIndex: i }
                        );
                    }

                    // chamada à API do random.org
                    const url = `https://www.random.org/integers/?num=1&min=${minValue}&max=${maxValue}&col=1&base=10&format=plain&rnd=new`;
                    
                    // constante com as opções da requisição HTTP
                    const options = {
                        method: 'GET' as const,
                        headers:{
                            'User-Agent': 'n8n-random-node/1.0.0',
                        }, timeout: 10000,
                    };

                    // faz a requisição HTTP
                    const response = await this.helpers.httpRequest({
                        ...options,
                        url,
                    });

                    // Se não houver resposta ou se a resposta for vazia, lança um erro
                    if(!response || response.toString().trim() === ''){
                        throw new NodeOperationError(
                            this.getNode(), 'No response from random.org', { itemIndex: i }
                        );
                    }

                    // resposta convertida em string e limpa espaços em branco
                    const responseText = response.toString().trim();
                    
                    // converte a resposta em um array de números inteiros
                    const randomNumber = parseInt(responseText, 10);

                    // Se randomNumber for 0 ou vazio, lança um erro
                    if(isNaN(randomNumber)){
                        throw new NodeOperationError(
                            this.getNode(), 'Invalid response from random.org', { itemIndex: i }
                        );
                    }

                    // prepara o dado de saída
                    const outputData: INodeExecutionData = {
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
            } catch (error){
                if(this.continueOnFail()){
                    returnData.push({
                        json: {
                            error: (error as Error).message,
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

