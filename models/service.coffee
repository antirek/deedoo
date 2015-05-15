module.exports =
  name:
    type: String
    required: true
  host_id:
    type: String
    required: true
  port: String
  resources: [
    id: String
    name: String
    username: String
    password: String
  ]
  dependencies: [
    service_id: String
    role: String
    resource_id: String
  ]