import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class OneLookupApi implements ICredentialType {
	name = 'oneLookupApi';

	displayName = '1Lookup API';

	icon: Icon = { light: 'file:../icons/1Lookup.svg', dark: 'file:../icons/1Lookup.dark.svg' };

	documentationUrl = 'https://app.1lookup.io/dashboard';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'sk_...',
			description: 'API key from your 1Lookup dashboard',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.1lookup.io',
			url: '/api/v1/account',
			method: 'GET',
		},
	};
}
