// Server entry point
import app from './app.js';
import { config } from './config/env.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
