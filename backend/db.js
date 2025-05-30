const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'instant8-secret-key';
const JWT_EXPIRES_IN = '24h';

const inMemoryDb = {
  users: [],
  deployments: [],
  cloudProviders: [],
  userSettings: []
};

const initInMemoryDb = () => {
  if (inMemoryDb.users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('password123', salt);
    
    inMemoryDb.users.push({
      id: 1,
      email: 'user@example.com',
      username: 'demo_user',
      hashed_password: hashedPassword,
      is_active: true,
      subscription_tier: 'free',
      created_at: new Date().toISOString()
    });
    
    console.log('Created default user in memory');
  }

  if (inMemoryDb.cloudProviders.length === 0) {
    const defaultUserId = inMemoryDb.users[0].id;
    inMemoryDb.cloudProviders = [
      { id: 1, name: 'aws', enabled: true, user_id: defaultUserId, credentials: {}, regions: ['us-east-1', 'us-west-1', 'eu-west-1'] },
      { id: 2, name: 'azure', enabled: true, user_id: defaultUserId, credentials: {}, regions: ['eastus', 'westus', 'westeurope'] },
      { id: 3, name: 'gcp', enabled: true, user_id: defaultUserId, credentials: {}, regions: ['us-central1', 'us-east1', 'europe-west1'] }
    ];
  }
  
  if (inMemoryDb.userSettings.length === 0) {
    const defaultUserId = inMemoryDb.users[0].id;
    inMemoryDb.userSettings.push({
      id: 1,
      user_id: defaultUserId,
      theme: 'light',
      notifications_enabled: true,
      email_notifications: true,
      budget_alert_threshold: 100,
      default_provider: 'aws',
      default_region: 'us-east-1'
    });
  }
  
  console.log('In-memory database initialized with default data');
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres@pg.neon.tech/instant8?sslmode=require&connect_timeout=10&application_name=instant8&pool_timeout=10&idle_timeout=30',
  ssl: {
    rejectUnauthorized: false // Required for Neon DB connections
  },
  max: 5, // Reduced maximum clients to prevent connection overload
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection not established
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

let usingInMemory = false;

const getClient = async () => {
  if (usingInMemory) {
    return {
      query: async (text, params) => {
        console.log('In-memory DB query:', text, params);
        return { rows: [] }; // Will be overridden by specific query implementations
      },
      release: () => {} // No-op for in-memory
    };
  }

  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      return client;
    } catch (err) {
      console.error(`Database connection error (${retries} retries left):`, err.message);
      retries--;
      if (retries === 0) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const testConnection = async () => {
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    console.log('Using in-memory database by configuration');
    usingInMemory = true;
    initInMemoryDb();
    return true;
  }

  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to Neon DB');
    return true;
  } catch (err) {
    console.error('Error connecting to Neon DB:', err);
    console.log('Falling back to in-memory database');
    usingInMemory = true;
    initInMemoryDb();
    return true; // Return true since we have a fallback
  } finally {
    if (client) client.release();
  }
};

const deploymentQueries = {
  createDeployment: async (deploymentData) => {
    const { name, description, status, user_id, providers, config, cost_estimate } = deploymentData;
    
    if (usingInMemory) {
      const now = new Date().toISOString();
      const newDeployment = {
        id: deploymentData.id || Math.floor(Math.random() * 10000).toString(),
        name,
        description,
        status,
        user_id,
        providers: typeof providers === 'string' ? JSON.parse(providers) : providers,
        config: typeof config === 'string' ? JSON.parse(config) : config,
        cost_estimate: typeof cost_estimate === 'string' ? JSON.parse(cost_estimate) : cost_estimate,
        created_at: now,
        updated_at: now
      };
      
      inMemoryDb.deployments.push(newDeployment);
      console.log('Created deployment in memory:', newDeployment.id);
      return newDeployment;
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        `INSERT INTO deployments 
         (name, description, status, user_id, providers, config, cost_estimate) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [name, description, status, user_id, JSON.stringify(providers), JSON.stringify(config), JSON.stringify(cost_estimate)]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error creating deployment:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  getDeployments: async (userId) => {
    if (usingInMemory) {
      return inMemoryDb.deployments.filter(d => d.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT * FROM deployments WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      
      return result.rows;
    } catch (err) {
      console.error('Error getting deployments:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  getDeploymentById: async (id) => {
    if (usingInMemory) {
      return inMemoryDb.deployments.find(d => d.id.toString() === id.toString());
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT * FROM deployments WHERE id = $1',
        [id]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error getting deployment by ID:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  updateDeployment: async (id, updates) => {
    const { name, description, status, providers, config, cost_estimate } = updates;
    
    if (usingInMemory) {
      const index = inMemoryDb.deployments.findIndex(d => d.id.toString() === id.toString());
      if (index === -1) return null;
      
      const deployment = inMemoryDb.deployments[index];
      const updatedDeployment = {
        ...deployment,
        name: name || deployment.name,
        description: description || deployment.description,
        status: status || deployment.status,
        providers: providers ? (typeof providers === 'string' ? JSON.parse(providers) : providers) : deployment.providers,
        config: config ? (typeof config === 'string' ? JSON.parse(config) : config) : deployment.config,
        cost_estimate: cost_estimate ? (typeof cost_estimate === 'string' ? JSON.parse(cost_estimate) : cost_estimate) : deployment.cost_estimate,
        updated_at: new Date().toISOString()
      };
      
      inMemoryDb.deployments[index] = updatedDeployment;
      console.log('Updated deployment in memory:', id);
      return updatedDeployment;
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        `UPDATE deployments 
         SET name = $1, 
             description = $2, 
             status = $3, 
             providers = $4, 
             config = $5, 
             cost_estimate = $6,
             updated_at = NOW()
         WHERE id = $7 
         RETURNING *`,
        [name, description, status, JSON.stringify(providers), JSON.stringify(config), JSON.stringify(cost_estimate), id]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error updating deployment:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  deleteDeployment: async (id) => {
    if (usingInMemory) {
      const index = inMemoryDb.deployments.findIndex(d => d.id.toString() === id.toString());
      if (index === -1) return false;
      
      inMemoryDb.deployments.splice(index, 1);
      console.log('Deleted deployment from memory:', id);
      return true;
    }
    
    let client;
    try {
      client = await getClient();
      await client.query(
        'DELETE FROM deployments WHERE id = $1',
        [id]
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting deployment:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
};

const cloudProviderQueries = {
  getCloudProviders: async (userId) => {
    if (usingInMemory) {
      return inMemoryDb.cloudProviders.filter(p => p.user_id === userId);
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT * FROM cloud_providers WHERE user_id = $1',
        [userId]
      );
      
      return result.rows;
    } catch (err) {
      console.error('Error getting cloud providers:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  updateCloudProvider: async (id, credentials) => {
    if (usingInMemory) {
      const index = inMemoryDb.cloudProviders.findIndex(p => p.id.toString() === id.toString());
      if (index === -1) return null;
      
      const provider = inMemoryDb.cloudProviders[index];
      const updatedProvider = {
        ...provider,
        credentials: typeof credentials === 'string' ? JSON.parse(credentials) : credentials,
        updated_at: new Date().toISOString()
      };
      
      inMemoryDb.cloudProviders[index] = updatedProvider;
      console.log('Updated cloud provider in memory:', id);
      return updatedProvider;
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        `UPDATE cloud_providers 
         SET credentials = $1, 
             updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [JSON.stringify(credentials), id]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error updating cloud provider:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
};

const userSettingsQueries = {
  getUserSettings: async (userId) => {
    if (usingInMemory) {
      return inMemoryDb.userSettings.find(s => s.user_id === userId);
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [userId]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error getting user settings:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  updateUserSettings: async (userId, settings) => {
    const { theme, notifications_enabled, email_notifications, budget_alert_threshold, default_provider, default_region } = settings;
    
    if (usingInMemory) {
      const index = inMemoryDb.userSettings.findIndex(s => s.user_id === userId);
      
      if (index === -1) {
        const newSettings = {
          id: Math.floor(Math.random() * 10000),
          user_id: userId,
          theme: theme || 'light',
          notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : true,
          email_notifications: email_notifications !== undefined ? email_notifications : true,
          budget_alert_threshold: budget_alert_threshold || 100,
          default_provider: default_provider || 'aws',
          default_region: default_region || 'us-east-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        inMemoryDb.userSettings.push(newSettings);
        console.log('Created user settings in memory for:', userId);
        return newSettings;
      } else {
        const userSettings = inMemoryDb.userSettings[index];
        const updatedSettings = {
          ...userSettings,
          theme: theme || userSettings.theme,
          notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : userSettings.notifications_enabled,
          email_notifications: email_notifications !== undefined ? email_notifications : userSettings.email_notifications,
          budget_alert_threshold: budget_alert_threshold || userSettings.budget_alert_threshold,
          default_provider: default_provider || userSettings.default_provider,
          default_region: default_region || userSettings.default_region,
          updated_at: new Date().toISOString()
        };
        
        inMemoryDb.userSettings[index] = updatedSettings;
        console.log('Updated user settings in memory for:', userId);
        return updatedSettings;
      }
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        `UPDATE user_settings 
         SET theme = $1, 
             notifications_enabled = $2, 
             email_notifications = $3, 
             budget_alert_threshold = $4, 
             default_provider = $5, 
             default_region = $6,
             updated_at = NOW()
         WHERE user_id = $7 
         RETURNING *`,
        [theme, notifications_enabled, email_notifications, budget_alert_threshold, default_provider, default_region, userId]
      );
      
      return result.rows[0];
    } catch (err) {
      console.error('Error updating user settings:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  }
};

const initDatabase = async () => {
  let client;
  
  try {
    client = await getClient();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL UNIQUE,
        hashed_password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        subscription_tier VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        providers JSONB NOT NULL,
        config JSONB NOT NULL,
        cost_estimate JSONB,
        resources JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS cloud_providers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        credentials JSONB,
        regions JSONB,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
        theme VARCHAR(50) DEFAULT 'light',
        notifications_enabled BOOLEAN DEFAULT true,
        email_notifications BOOLEAN DEFAULT true,
        budget_alert_threshold NUMERIC DEFAULT 100,
        default_provider VARCHAR(50) DEFAULT 'aws',
        default_region VARCHAR(50) DEFAULT 'us-east',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    const userResult = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userResult.rows[0].count) === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('password123', salt);
      
      await client.query(
        `INSERT INTO users (email, username, hashed_password) 
         VALUES ($1, $2, $3)`,
        ['user@example.com', 'demo_user', hashedPassword]
      );
      
      console.log('Created default user in database');
    }
    
    console.log('Database tables initialized successfully');
    return true;
  } catch (err) {
    console.error('Error initializing database tables:', err);
    return false;
  } finally {
    if (client) client.release();
  }
};

const userQueries = {
  registerUser: async (email, username, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    if (usingInMemory) {
      const existingUser = inMemoryDb.users.find(
        u => u.email === email || u.username === username
      );
      
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }
      
      const newUser = {
        id: inMemoryDb.users.length + 1,
        email,
        username,
        hashed_password: hashedPassword,
        is_active: true,
        subscription_tier: 'free',
        created_at: new Date().toISOString()
      };
      
      inMemoryDb.users.push(newUser);
      console.log('Registered user in memory:', newUser.id);
      
      const token = jwt.sign(
        { user_id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return { user: { ...newUser, hashed_password: undefined }, token };
    }
    
    let client;
    try {
      client = await getClient();
      
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('User with this email or username already exists');
      }
      
      const result = await client.query(
        `INSERT INTO users (email, username, hashed_password) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, username, is_active, subscription_tier, created_at`,
        [email, username, hashedPassword]
      );
      
      const newUser = result.rows[0];
      
      const token = jwt.sign(
        { user_id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return { user: newUser, token };
    } catch (err) {
      console.error('Error registering user:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  loginUser: async (email, password) => {
    if (usingInMemory) {
      const user = inMemoryDb.users.find(u => u.email === email);
      
      if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
        throw new Error('Invalid email or password');
      }
      
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return { user: { ...user, hashed_password: undefined }, token };
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }
      
      const user = result.rows[0];
      
      if (!bcrypt.compareSync(password, user.hashed_password)) {
        throw new Error('Invalid email or password');
      }
      
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      delete user.hashed_password;
      
      return { user, token };
    } catch (err) {
      console.error('Error logging in user:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  getUserById: async (id) => {
    if (usingInMemory) {
      const user = inMemoryDb.users.find(u => u.id.toString() === id.toString());
      if (!user) return null;
      
      return { ...user, hashed_password: undefined };
    }
    
    let client;
    try {
      client = await getClient();
      const result = await client.query(
        'SELECT id, email, username, is_active, subscription_tier, created_at FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error getting user by ID:', err);
      throw err;
    } finally {
      if (client) client.release();
    }
  },
  
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      console.error('Error verifying token:', err);
      return null;
    }
  }
};

module.exports = {
  pool,
  getClient,
  testConnection,
  initDatabase,
  initInMemoryDb,
  deploymentQueries,
  cloudProviderQueries,
  userSettingsQueries,
  userQueries,
  inMemoryDb
};
