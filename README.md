# @momentum-labs/n8n-nodes-1lookup

Use 1Lookup in n8n workflows to validate, enrich, and risk-score email addresses, phone numbers, IP addresses, and domains.

This package provides a community node for the [1Lookup](https://app.1lookup.io) API. It is built for fraud prevention, lead enrichment, contact verification, order review, and data-quality automation workflows.

## Features

- Validate email addresses before adding them to a CRM, list, or outbound workflow.
- Validate, classify, scrub, and spam-check phone numbers.
- Append missing email or phone data from contact identity fields.
- Reverse lookup contact details from an email address, phone number, or IP address.
- Analyze domain SEO authority, backlinks, traffic, and related domain intelligence signals.
- Return full API responses or simplified `data` payloads for easier downstream mapping.
- Use the node as an n8n AI tool where supported.

## Installation

### n8n Community Nodes UI

1. Open your n8n instance.
2. Go to **Settings** > **Community Nodes**.
3. Select **Install**.
4. Enter this package name:

```text
@momentum-labs/n8n-nodes-1lookup
```

1. Confirm the installation and restart n8n if your environment requires it.

### Self-Hosted npm Install

If your n8n setup installs community nodes through npm, install the package from your n8n environment:

```bash
npm install @momentum-labs/n8n-nodes-1lookup
```

Then restart n8n so it can discover the node.

## Credentials

The node uses a `1Lookup API` credential.

1. Sign in to the [1Lookup Dashboard](https://app.1lookup.io/dashboard).
2. Copy your API key.
3. In n8n, create a new `1Lookup API` credential.
4. Paste the API key and save.
5. Use the built-in credential test to verify the connection.

The credential sends the API key using both supported headers:

```text
Authorization: Bearer <api_key>
X-API-KEY: <api_key>
```

## Available Operations

The package includes one `1Lookup` node with grouped resources.


| Resource | Operation                | Required input                                 | API route                         |
| -------- | ------------------------ | ---------------------------------------------- | --------------------------------- |
| Email    | Validate Email           | Email                                          | `/api/v1/email`                   |
| Email    | Append Email             | First Name, Last Name, Address, City, ZIP Code | `/api/v1/email-append`            |
| Email    | Look Up Contact by Email | Email                                          | `/api/v1/reverse-email-append`    |
| Phone    | Validate Phone           | Phone Number                                   | `/api/v1/phone`                   |
| Phone    | Check Phone for Spam     | Phone Number                                   | `/api/v1/phone-spam`              |
| Phone    | Scrub Phone              | Phone Number                                   | `/api/v1/phone-scrub`             |
| Phone    | Append Phone             | First Name, Last Name, Address, City, ZIP Code | `/api/v1/phone-append`            |
| Phone    | Look Up Contact by Phone | Phone Number                                   | `/api/v1/reverse-phone-lookup`    |
| IP       | Look Up IP Address       | IP Address                                     | `/api/v1/ip`                      |
| IP       | Look Up Contact by IP    | IP Address                                     | `/api/v1/reverse-ip-append`       |
| Domain   | Analyze Domain SEO       | Domain                                         | `/api/v1/domain-seo-intelligence` |


## Common Workflows

### Review risky orders

Use Shopify, Stripe, WooCommerce, or another order trigger, then pass the customer's email, phone, and IP address into 1Lookup. Route medium-risk or high-risk results to manual review, Slack, email, or your fraud operations queue.

### Clean CRM records

Use records from HubSpot, Salesforce, Airtable, Google Sheets, or a database node. Validate email and phone fields, then update the record with deliverability, phone type, risk, and match status.

### Enrich incomplete leads

Use Append Email or Append Phone when you have name and address data but missing contact fields. Continue only when the response indicates a match and your internal compliance rules allow contact use.

### Analyze domains

Use Analyze Domain SEO to collect authority, backlink, traffic, and trust signals for lead scoring, partner review, marketplace checks, or domain intelligence workflows.

## Output

By default, the node returns the full 1Lookup API response, including fields such as:

- `success`
- `data.request`
- `data.metadata`
- `data.risk_assessment`
- `data.classification`
- `data.insights`
- `data.recommendations`

Enable **Simplify Response** to return only the nested `data` object when the API response contains one. This is useful when mapping fields into later n8n nodes.

## Notes and Limits

- This node only calls 1Lookup API endpoints. It does not perform web scraping or crawl third-party websites.
- API usage, credits, rate limits, and available data depend on your 1Lookup account and plan.
- Phone and contact data should be used according to your business compliance requirements, including consent, DNC, TCPA, CAN-SPAM, GDPR, CCPA, and any other applicable regulations.
- For production workflows, add error handling with n8n's continue-on-fail, IF, or error workflow patterns.

## Compatibility

- Node.js: `^20.19.0 || >=22.13.0`
- n8n community node package format: `n8nNodesApiVersion` 1
- Package name: `@momentum-labs/n8n-nodes-1lookup`
- Node display name: `1Lookup`
- Credential display name: `1Lookup API`

## Development

Install dependencies:

```bash
npm install
```

Run the node locally in n8n development mode:

```bash
npm run dev
```

Build the package:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Auto-fix supported lint issues:

```bash
npm run lint:fix
```

Preview the npm package contents:

```bash
npm pack --dry-run
```

## Support

- 1Lookup dashboard: [https://app.1lookup.io/dashboard](https://app.1lookup.io/dashboard)
- 1Lookup API docs: [https://app.1lookup.io/api](https://app.1lookup.io/api)
- n8n community node installation docs: [https://docs.n8n.io/integrations/community-nodes/installation/](https://docs.n8n.io/integrations/community-nodes/installation/)
- n8n custom node docs: [https://docs.n8n.io/integrations/creating-nodes/](https://docs.n8n.io/integrations/creating-nodes/)

## License

MIT
