export default {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    type: { enum: ["entrepreneur", "investor"] },
    phone: { type: "string" },
    password: { type: "string" },
  },
  required: ["name", "email", "type", "phone", "password"],
} as const;
