# Postman Collection for Prayas API

## Import Instructions

1. Open Postman
2. Click "Import" button
3. Select "Raw text" tab
4. Copy and paste the JSON below
5. Click "Import"

## Collection JSON

```json
{
  "info": {
    "name": "Prayas API",
    "description": "Complete API collection for Prayas Backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"+919876543210\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@test.com\",\n  \"password\": \"user123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/auth/me",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "profile"]
            }
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated Name\",\n  \"phone\": \"+919999999999\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "profile"]
            }
          }
        },
        {
          "name": "Get Dashboard",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/dashboard",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "dashboard"]
            }
          }
        },
        {
          "name": "Get Impact Stats",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/impact-stats",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "impact-stats"]
            }
          }
        }
      ]
    },
    {
      "name": "Pickups",
      "item": [
        {
          "name": "Schedule Pickup",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"pickupDate\": \"2024-01-15T10:00:00Z\",\n  \"timeSlot\": \"9AM-12PM\",\n  \"address\": {\n    \"street\": \"123 Main St\",\n    \"city\": \"Bangalore\",\n    \"state\": \"Karnataka\",\n    \"pincode\": \"560001\"\n  },\n  \"materials\": [\n    {\n      \"type\": \"paper\",\n      \"estimatedWeight\": 10\n    },\n    {\n      \"type\": \"plastic\",\n      \"estimatedWeight\": 5\n    }\n  ],\n  \"selectedNGO\": \"{{ngoId}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/pickups",
              "host": ["{{baseUrl}}"],
              "path": ["api", "pickups"]
            }
          }
        },
        {
          "name": "Get User Pickups",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/pickups",
              "host": ["{{baseUrl}}"],
              "path": ["api", "pickups"]
            }
          }
        },
        {
          "name": "Get Pickup by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/pickups/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "pickups", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "pickup_id_here"
                }
              ]
            }
          }
        },
        {
          "name": "Update Pickup Status",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"collected\",\n  \"materials\": [\n    {\n      \"type\": \"paper\",\n      \"actualWeight\": 12\n    }\n  ]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/pickups/:id/status",
              "host": ["{{baseUrl}}"],
              "path": ["api", "pickups", ":id", "status"],
              "variable": [
                {
                  "key": "id",
                  "value": "pickup_id_here"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "NGOs",
      "item": [
        {
          "name": "Get All NGOs",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/ngos",
              "host": ["{{baseUrl}}"],
              "path": ["api", "ngos"]
            }
          }
        },
        {
          "name": "Get NGO by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/ngos/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "ngos", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "ngo_id_here"
                }
              ]
            }
          }
        },
        {
          "name": "Get NGO Categories",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/ngos/categories",
              "host": ["{{baseUrl}}"],
              "path": ["api", "ngos", "categories"]
            }
          }
        }
      ]
    },
    {
      "name": "Leaderboard",
      "item": [
        {
          "name": "Get Global Leaderboard",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/leaderboard/global?period=all-time&limit=100",
              "host": ["{{baseUrl}}"],
              "path": ["api", "leaderboard", "global"],
              "query": [
                {
                  "key": "period",
                  "value": "all-time"
                },
                {
                  "key": "limit",
                  "value": "100"
                }
              ]
            }
          }
        },
        {
          "name": "Get Community Leaderboard",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/leaderboard/community?community=Bangalore&period=monthly",
              "host": ["{{baseUrl}}"],
              "path": ["api", "leaderboard", "community"],
              "query": [
                {
                  "key": "community",
                  "value": "Bangalore"
                },
                {
                  "key": "period",
                  "value": "monthly"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "admin", "users"]
            }
          }
        },
        {
          "name": "Get Platform Stats",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/stats/overview",
              "host": ["{{baseUrl}}"],
              "path": ["api", "admin", "stats", "overview"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    },
    {
      "key": "adminToken",
      "value": "",
      "type": "string"
    },
    {
      "key": "ngoId",
      "value": "",
      "type": "string"
    }
  ]
}
```

## Environment Variables

Set up these variables in Postman:

- `baseUrl`: `http://localhost:5000` (or your server URL)
- `token`: JWT token from login (auto-set after login)
- `adminToken`: Admin JWT token
- `ngoId`: An NGO ID for testing pickups

## Usage Tips

1. **Login First**: Use the Login request to get a token, then copy it to the `token` variable
2. **Test Flow**: Register → Login → Get Profile → Schedule Pickup → View Pickups
3. **Admin Access**: Login as admin to access admin endpoints
4. **Update Variables**: Replace `:id` placeholders with actual IDs from responses

