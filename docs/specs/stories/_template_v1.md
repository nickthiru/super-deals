# Story Template

## Feature: [Feature Name]

Story: [Story Name]

As a [role]  
I want to [action/goal]  
So that [benefit/value]

## Background

Given I am a [role]  
 And [any prerequisite conditions]

## Rules and Scenarios

Rule: [Business rule description]

**Scenario: [Happy path scenario name]**  
 Given [initial context]  
 When [action is performed]  
 And [additional actions if needed]  
 Then [expected outcome]  
 And [additional outcomes if needed]

**Scenario: [Alternative/error path scenario name]**  
 Given [initial context]  
 When [action is performed]  
 Then [expected outcome]

## Acceptance Criteria

- [ ] [Specific testable requirement 1]
- [ ] [Specific testable requirement 2]
- [ ] [Specific testable requirement 3]

## Technical Constraints

- Input/Output limits: [specify limits]
- File requirements: [specify if applicable]
- Performance requirements: [specify if applicable]
- Security requirements: [specify if applicable]

## Dependencies

- Authentication: [specify requirements]
- Storage: [specify requirements]
- External Services: [specify requirements]

## Testing Scope

- Unit Tests:
  - [Component/function to test]
  - [Expected behavior to verify]
- Integration Tests:
  - [Integration points to test]
  - [Expected system behavior]
- E2E Tests:
  - [User flow to test]
  - [Expected end-to-end behavior]

## Backend

### API Gateway

HTTP: [base URL]
[METHOD] [path]
Headers:
[header name]: [description]

      Query Parameters:
        [param name]: [type]; [required/optional]; [description]

      Body:
        {
          [field]: [type]; [required/optional]; [description]
        }

      Responses:
        [status code]:
          {
            [field]: [type]; [required/optional]; [description]
          }

### Storage (S3/DynamoDB)

[Storage type]:
[Resource name]:
[Schema/Structure details]

### Lambda Functions

[function-name]:
Purpose: [brief description]
Triggers: [what invokes this function]
Permissions: [required IAM permissions]

## Frontend

### Route

[path]: Components:

      [component name]:
        Purpose: [brief description]
        Props: [if applicable]
        State: [if applicable]

    Page Server:
      Actions:
        [action name]: [description]

### UI Components

[List any specific UI components needed]

### State Management

[Describe any state management requirements]

## Notes

- [Any additional implementation notes]
- [Known limitations]
- [Future considerations]
