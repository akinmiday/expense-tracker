// Configure CORS
export const corsOptions = {
  origin: true, // Allow requests from this origin
  methods: "GET,POST,PUT,DELETE", // Allow these HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow these headers
  credentials: true, // Allow credentials (e.g., cookies)
};
