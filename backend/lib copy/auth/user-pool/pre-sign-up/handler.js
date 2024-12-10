exports.handler = async (event) => {
  const intendedGroup = event.request.userAttributes['custom:group'];

  if (intendedGroup === 'Consumer') {
    // Allow self sign-up for Consumers
    event.response.autoConfirmUser = true;
  } else {
    // Deny self sign-up for other groups
    throw new Error('Self sign-up is not allowed for this user group');
  }

  return event;
};