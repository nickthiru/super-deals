# Story Template

## Feature: [Feature Name]

Story: [Story Name]

_As a_ [role]  
_I want to_ [action/goal]  
_So that_ [benefit/value]

## Background

_Given_ I am a [role]  
_And_ [any prerequisite conditions]

## Rules and Scenarios

Rule: [Business rule description]

**Scenario: [Happy path scenario name]**  
 _Given_ [initial context]  
 _When_ [action is performed]  
 _And_ [additional actions if needed]  
 _Then_ [expected outcome]  
 _And_ [additional outcomes if needed]

**Scenario: [Alternative/error path scenario name]**  
 _Given_ [initial context]  
 _When_ [action is performed]  
 _Then_ [expected outcome]

## Backend

### API Gateway

**Method**: [METHOD]  
**Path**: [path]  
**Headers**:  
[header name]: [description]

    **Query Parameters**:
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

### Storage

[Storage type]:
[Resource name]:
[Schema/Structure details]:

### DB

[DB type]:
[Resource name]:
[Schema/Structure details]:

### Lambda

Name: [function-name]  
Purpose: [brief description]  
Triggers: [what invokes this function]  
Permissions: [required permissions]

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
