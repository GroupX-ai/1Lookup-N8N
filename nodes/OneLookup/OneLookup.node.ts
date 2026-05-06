import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const contactInputFields: INodeProperties[] = [
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		required: true,
	},
	{
		displayName: 'ZIP Code',
		name: 'zip',
		type: 'string',
		default: '',
		required: true,
	},
];

function toItemJson(response: unknown, simplify: boolean): IDataObject {
	if (simplify && isObject(response) && isObject(response.data)) {
		return response.data;
	}

	if (isObject(response)) {
		return response;
	}

	if (Array.isArray(response)) {
		return { results: response as unknown[] };
	}

	return { value: response as string | number | boolean | null };
}

function isObject(value: unknown): value is IDataObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getContactInput(ctx: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		firstName: ctx.getNodeParameter('firstName', itemIndex),
		lastName: ctx.getNodeParameter('lastName', itemIndex),
		address: ctx.getNodeParameter('address', itemIndex),
		city: ctx.getNodeParameter('city', itemIndex),
		zip: ctx.getNodeParameter('zip', itemIndex),
	};
}

function buildRequestOptions(
	ctx: IExecuteFunctions,
	resource: string,
	operation: string,
	itemIndex: number,
): IHttpRequestOptions {
	const options: IHttpRequestOptions = {
		baseURL: 'https://app.1lookup.io',
		url: '',
		method: 'POST' as IHttpRequestMethods,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: {},
		json: true,
	};

	if (resource === 'email' && operation === 'validate') {
		options.url = '/api/v1/email';
		options.body = {
			email: ctx.getNodeParameter('email', itemIndex),
		};
		return options;
	}

	if (resource === 'email' && operation === 'append') {
		options.url = '/api/v1/email-append';
		options.body = {
			input: getContactInput(ctx, itemIndex),
		};
		return options;
	}

	if (resource === 'email' && operation === 'lookupContact') {
		options.url = '/api/v1/reverse-email-append';
		options.body = {
			email: ctx.getNodeParameter('email', itemIndex),
		};
		return options;
	}

	if (resource === 'ip' && operation === 'lookup') {
		options.url = '/api/v1/ip';
		options.body = {
			ip: ctx.getNodeParameter('ip', itemIndex),
		};
		return options;
	}

	if (resource === 'ip' && operation === 'lookupContact') {
		options.url = '/api/v1/reverse-ip-append';
		options.body = {
			ip: ctx.getNodeParameter('ip', itemIndex),
		};
		return options;
	}

	if (resource === 'phone' && operation === 'validate') {
		options.url = '/api/v1/phone';
		options.body = {
			phone_number: ctx.getNodeParameter('phoneNumber', itemIndex),
		};
		return options;
	}

	if (resource === 'phone' && operation === 'checkSpam') {
		options.url = '/api/v1/phone-spam';
		options.body = {
			phone_number: ctx.getNodeParameter('phoneNumber', itemIndex),
		};
		return options;
	}

	if (resource === 'phone' && operation === 'scrub') {
		options.url = '/api/v1/phone-scrub';
		options.body = {
			phone_number: ctx.getNodeParameter('phoneNumber', itemIndex),
		};
		return options;
	}

	if (resource === 'phone' && operation === 'append') {
		options.url = '/api/v1/phone-append';
		options.body = {
			input: getContactInput(ctx, itemIndex),
		};
		return options;
	}

	if (resource === 'phone' && operation === 'lookupContact') {
		options.url = '/api/v1/reverse-phone-lookup';
		options.body = {
			phone_number: ctx.getNodeParameter('phoneNumber', itemIndex),
		};
		return options;
	}

	if (resource === 'domain' && operation === 'analyzeSeo') {
		options.url = '/api/v1/domain-seo-intelligence';
		options.body = {
			domain: ctx.getNodeParameter('domain', itemIndex),
			bypass_cache: ctx.getNodeParameter('bypassCache', itemIndex, false),
		};
		return options;
	}

	throw new NodeOperationError(ctx.getNode(), `Unsupported operation: ${resource}/${operation}`);
}

export class OneLookup implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1Lookup',
		name: 'oneLookup',
		icon: { light: 'file:1Lookup.svg', dark: 'file:1Lookup.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Validate and enrich email, phone, IP, and domain data with 1Lookup',
		defaults: {
			name: '1Lookup',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'oneLookupApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'email',
				options: [
					{ name: 'Domain', value: 'domain' },
					{ name: 'Email', value: 'email' },
					{ name: 'IP', value: 'ip' },
					{ name: 'Phone', value: 'phone' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'validate',
				displayOptions: {
					show: {
						resource: ['email'],
					},
				},
				options: [
					{ name: 'Append Email', value: 'append', action: 'Append email to a contact' },
					{ name: 'Look Up Contact by Email', value: 'lookupContact', action: 'Look up contact by email' },
					{ name: 'Validate Email', value: 'validate', action: 'Validate an email address' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'lookup',
				displayOptions: {
					show: {
						resource: ['ip'],
					},
				},
				options: [
					{ name: 'Look Up Contact by IP', value: 'lookupContact', action: 'Look up contact by IP' },
					{ name: 'Look Up IP Address', value: 'lookup', action: 'Look up an IP address' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'validate',
				displayOptions: {
					show: {
						resource: ['phone'],
					},
				},
				options: [
					{ name: 'Append Phone', value: 'append', action: 'Append phone to a contact' },
					{ name: 'Check Phone for Spam', value: 'checkSpam', action: 'Check a phone number for spam' },
					{ name: 'Look Up Contact by Phone', value: 'lookupContact', action: 'Look up contact by phone' },
					{ name: 'Scrub Phone', value: 'scrub', action: 'Scrub a phone number' },
					{ name: 'Validate Phone', value: 'validate', action: 'Validate a phone number' },
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'analyzeSeo',
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{ name: 'Analyze Domain SEO', value: 'analyzeSeo', action: 'Analyze domain SEO' },
				],
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'name@example.com',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['validate', 'lookupContact'],
					},
				},
			},
			...contactInputFields.map((field) => ({
				...field,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['append'],
					},
				},
			})),
			{
				displayName: 'IP Address',
				name: 'ip',
				type: 'string',
				default: '',
				required: true,
				placeholder: '8.8.8.8',
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['lookup', 'lookupContact'],
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				required: true,
				placeholder: '+15551234567',
				displayOptions: {
					show: {
						resource: ['phone'],
						operation: ['validate', 'checkSpam', 'scrub', 'lookupContact'],
					},
				},
			},
			...contactInputFields.map((field) => ({
				...field,
				displayOptions: {
					show: {
						resource: ['phone'],
						operation: ['append'],
					},
				},
			})),
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'theverge.com',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['analyzeSeo'],
					},
				},
			},
			{
				displayName: 'Bypass Cache',
				name: 'bypassCache',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['analyzeSeo'],
					},
				},
			},
			{
				displayName: 'Simplify Response',
				name: 'simplify',
				type: 'boolean',
				default: false,
				description: 'Whether to return only the nested data object when available',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const simplify = this.getNodeParameter('simplify', itemIndex, false) as boolean;

				const options = buildRequestOptions(this, resource, operation, itemIndex);
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'oneLookupApi',
					options,
				);

				returnData.push({
					json: toItemJson(response, simplify),
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (isObject(error as unknown)) {
					throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
