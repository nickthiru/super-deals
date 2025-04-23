// SNS utility module for publishing messages to SNS topics
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { dev } from '$app/environment';

// Create a singleton SNS client
const snsClient = new SNSClient({ region: 'us-east-1' });

/**
 * Publishes a message to an SNS topic
 * @param {string} topicArn - The ARN of the SNS topic
 * @param {Object} message - The message object to publish
 * @param {string} [subject] - Optional subject for the message
 * @returns {Promise<Object>} - The SNS publish result
 */
export async function publishToTopic(topicArn, message, subject = undefined) {
  if (!topicArn) {
    console.error('Missing SNS topic ARN');
    throw new Error('Missing SNS topic ARN');
  }

  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(message),
    MessageAttributes: {},
  };
  
  if (subject) {
    params.Subject = subject;
  }
  
  try {
    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    
    if (dev) {
      console.log(`Message published to SNS topic: ${topicArn}`);
      console.log('Message content:', message);
    }
    
    return result;
  } catch (error) {
    console.error('Error publishing to SNS:', error);
    // Don't rethrow - we don't want to break the user flow if SNS fails
    return { error: error.message };
  }
}
