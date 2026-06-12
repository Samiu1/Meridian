/**
 * Connector stubs. Real Jira/Confluence/Slack/Amplitude connectors replace
 * these, one module per service, behind the same function signatures.
 * Never import connector SDKs in /src/agent — only through this boundary.
 */

export async function createTicket(input: {
  title: string;
  body: string;
  project: string;
}): Promise<string> {
  // TODO: Jira/Linear connector. Stub returns a fake URL so the loop is testable.
  return `https://tracker.example.com/${input.project}/STUB-1?title=${encodeURIComponent(input.title)}`;
}

export async function postUpdate(input: {
  channel: string;
  message: string;
}): Promise<void> {
  // TODO: Slack connector.
  console.log(`[stub] would post to ${input.channel}: ${input.message.slice(0, 80)}`);
}
