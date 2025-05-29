require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { testConnection, initDatabase, deploymentQueries, cloudProviderQueries, userSettingsQueries } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

(async () => {
  const connected = await testConnection();
  if (connected) {
    console.log('Connected to Neon DB');
    await initDatabase();
  } else {
    console.error('Failed to connect to Neon DB');
  }
})();


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Instant8 API is running' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    res.status(201).json({
      access_token: "placeholder_token",
      token_type: "bearer"
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    res.status(200).json({
      access_token: "placeholder_token",
      token_type: "bearer"
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.get('/user/profile', async (req, res) => {
  try {
    res.status(200).json({
      id: 1,
      email: "user@example.com",
      username: "demo_user",
      subscription_tier: "free",
      created_at: new Date().toISOString(),
      is_active: true
    });
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

app.get('/pricing/tiers', async (req, res) => {
  try {
    const tiers = [
      {
        name: "Basic",
        price: 44.0,
        features: ["Up to 5 deployments", "Email support", "Basic monitoring", "1 concurrent instance"],
        max_deployments: 5,
        max_concurrent_instances: 1,
        support_level: "email"
      },
      {
        name: "Professional",
        price: 74.0,
        features: ["Up to 25 deployments", "Priority support", "Advanced monitoring", "5 concurrent instances", "Multi-cloud", "Auto-scaling"],
        max_deployments: 25,
        max_concurrent_instances: 5,
        support_level: "priority"
      },
      {
        name: "Enterprise",
        price: 94.0,
        features: ["Unlimited deployments", "24/7 phone support", "Custom integrations", "Unlimited concurrent instances", "Dedicated account manager", "SLA guarantee"],
        max_deployments: -1,
        max_concurrent_instances: -1,
        support_level: "phone"
      }
    ];
    
    res.status(200).json(tiers);
  } catch (err) {
    console.error('Error getting pricing tiers:', err);
    res.status(500).json({ error: 'Failed to get pricing tiers' });
  }
});

app.post('/deployments', async (req, res) => {
  try {
    const deploymentData = {
      name: req.body.prompt.substring(0, 50), // Use first 50 chars of prompt as name
      description: req.body.prompt,
      status: 'configuring',
      user_id: req.body.user_id || 'demo-user', // Default user ID for demo
      providers: req.body.providers || ['aws'],
      config: {
        performance: 'standard',
        region: 'us-east-1',
        auto_terminate_hours: req.body.auto_terminate_hours || 24
      },
      cost_estimate: {
        total: Math.floor(Math.random() * 100) + 20, // Random cost between 20-120
        breakdown: {
          compute: Math.floor(Math.random() * 50) + 10,
          storage: Math.floor(Math.random() * 30) + 5,
          network: Math.floor(Math.random() * 20) + 5
        }
      }
    };
    
    const deployment = await deploymentQueries.createDeployment(deploymentData);
    
    const response = {
      deployment_id: deployment.id.toString(),
      status: deployment.status,
      estimated_cost: deployment.cost_estimate.total,
      instance_details: deployment.config
    };
    
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating deployment:', err);
    res.status(500).json({ error: 'Failed to create deployment' });
  }
});

app.get('/deployments', async (req, res) => {
  try {
    const userId = req.query.user_id || 'demo-user';
    const deployments = await deploymentQueries.getDeployments(userId);
    
    const formattedDeployments = deployments.map(deployment => ({
      id: deployment.id,
      name: deployment.name,
      description: deployment.description,
      status: deployment.status,
      providers: deployment.providers || ['aws'],
      created_at: deployment.created_at || new Date().toISOString(),
      updated_at: deployment.updated_at || new Date().toISOString(),
      config: deployment.config || {
        performance: 'standard',
        region: 'us-east-1'
      },
      cost_estimate: deployment.cost_estimate || {
        total: Math.floor(Math.random() * 100) + 20
      }
    }));
    
    res.status(200).json(formattedDeployments);
  } catch (err) {
    console.error('Error getting deployments:', err);
    res.status(500).json({ error: 'Failed to get deployments' });
  }
});

app.get('/deployments/:id', async (req, res) => {
  try {
    const deployment = await deploymentQueries.getDeploymentById(req.params.id);
    
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    res.status(200).json(deployment);
  } catch (err) {
    console.error('Error getting deployment:', err);
    res.status(500).json({ error: 'Failed to get deployment' });
  }
});

app.put('/deployments/:id', async (req, res) => {
  try {
    const deployment = await deploymentQueries.updateDeployment(req.params.id, req.body);
    
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    res.status(200).json(deployment);
  } catch (err) {
    console.error('Error updating deployment:', err);
    res.status(500).json({ error: 'Failed to update deployment' });
  }
});

app.delete('/deployments/:id', async (req, res) => {
  try {
    const success = await deploymentQueries.deleteDeployment(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting deployment:', err);
    res.status(500).json({ error: 'Failed to delete deployment' });
  }
});

app.get('/cloud-providers', async (req, res) => {
  try {
    const userId = req.query.user_id || 'demo-user';
    const providers = await cloudProviderQueries.getCloudProviders(userId);
    res.status(200).json(providers);
  } catch (err) {
    console.error('Error getting cloud providers:', err);
    res.status(500).json({ error: 'Failed to get cloud providers' });
  }
});

app.put('/cloud-providers/:id', async (req, res) => {
  try {
    const provider = await cloudProviderQueries.updateCloudProvider(req.params.id, req.body);
    
    if (!provider) {
      return res.status(404).json({ error: 'Cloud provider not found' });
    }
    
    res.status(200).json(provider);
  } catch (err) {
    console.error('Error updating cloud provider:', err);
    res.status(500).json({ error: 'Failed to update cloud provider' });
  }
});

app.get('/user-settings', async (req, res) => {
  try {
    const userId = req.query.user_id || 'demo-user';
    const settings = await userSettingsQueries.getUserSettings(userId);
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error getting user settings:', err);
    res.status(500).json({ error: 'Failed to get user settings' });
  }
});

app.put('/user-settings', async (req, res) => {
  try {
    const userId = req.body.user_id || 'demo-user';
    const settings = await userSettingsQueries.updateUserSettings(userId, req.body);
    res.status(200).json(settings);
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).json({ error: 'Failed to update user settings' });
  }
});

app.post('/deployments/:id/deploy', async (req, res) => {
  try {
    const deployment = await deploymentQueries.getDeploymentById(req.params.id);
    
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    const updatedDeployment = await deploymentQueries.updateDeployment(req.params.id, {
      ...deployment,
      status: 'deploying'
    });
    
    setTimeout(async () => {
      try {
        await deploymentQueries.updateDeployment(req.params.id, {
          ...updatedDeployment,
          status: 'running'
        });
        console.log(`Deployment ${req.params.id} status updated to running`);
      } catch (err) {
        console.error(`Error updating deployment ${req.params.id} status:`, err);
      }
    }, 10000); // 10 second delay to simulate deployment
    
    res.status(200).json(updatedDeployment);
  } catch (err) {
    console.error('Error deploying:', err);
    res.status(500).json({ error: 'Failed to deploy' });
  }
});

app.post('/deployments/:id/stop', async (req, res) => {
  try {
    const deployment = await deploymentQueries.getDeploymentById(req.params.id);
    
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    const updatedDeployment = await deploymentQueries.updateDeployment(req.params.id, {
      ...deployment,
      status: 'stopped'
    });
    
    res.status(200).json(updatedDeployment);
  } catch (err) {
    console.error('Error stopping deployment:', err);
    res.status(500).json({ error: 'Failed to stop deployment' });
  }
});

app.get('/dashboard/stats', async (req, res) => {
  try {
    const userId = req.query.user_id || 'demo-user';
    const deployments = await deploymentQueries.getDeployments(userId);
    
    const stats = {
      total_deployments: deployments.length,
      active_deployments: deployments.filter(d => d.status === 'running').length,
      total_providers: [...new Set(deployments.flatMap(d => d.providers || ['aws']))].length,
      total_cost: deployments.reduce((sum, d) => sum + (d.cost_estimate?.total || 0), 0),
      recent_deployments: deployments.slice(0, 5).map(d => ({
        id: d.id,
        name: d.name,
        status: d.status,
        provider: d.providers?.[0] || 'aws',
        created_at: d.created_at || new Date().toISOString()
      }))
    };
    
    res.status(200).json(stats);
  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
