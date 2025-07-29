import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Banner,
  Spinner,
  Stack,
  Checkbox,
  Select,
  Text
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    threshold_amount: 100,
    gift_product_id: '',
    gift_variant_id: '',
    is_active: false
  });
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
    loadProducts();
  }, []);

  useEffect(() => {
    if (settings.gift_product_id) {
      loadVariants(settings.gift_product_id);
    }
  }, [settings.gift_product_id]);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/gifts/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    }
  };

  const loadProducts = async () => {
    try {
      // In a real app, you'd fetch from Shopify API
      // For now, we'll simulate with mock data
      setProducts([
        { value: 'prod_1', label: 'Sample Keychain - $5' },
        { value: 'prod_2', label: 'Branded Sticker Pack - $3' },
        { value: 'prod_3', label: 'Mini Notebook - $8' },
        { value: 'prod_4', label: 'Phone Stand - $12' }
      ]);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const loadVariants = async (productId) => {
    try {
      // Mock variants for selected product
      setVariants([
        { value: `${productId}_var_1`, label: 'Default Variant' },
        { value: `${productId}_var_2`, label: 'Color: Red' },
        { value: `${productId}_var_3`, label: 'Color: Blue' }
      ]);
    } catch (err) {
      console.error('Error loading variants:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate settings
      if (settings.threshold_amount <= 0) {
        throw new Error('Threshold amount must be greater than 0');
      }

      if (settings.is_active && (!settings.gift_product_id || !settings.gift_variant_id)) {
        throw new Error('Please select a gift product and variant before activating');
      }

      await axios.post('/api/gifts/settings', settings);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.error || err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear variant when product changes
    if (field === 'gift_product_id') {
      setSettings(prev => ({
        ...prev,
        gift_variant_id: ''
      }));
    }
  };

  if (loading) {
    return (
      <Page title="Free Gift Settings">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center">
                <Spinner size="large" />
                <Text>Loading settings...</Text>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page 
      title="Free Gift Settings"
      subtitle="Configure when and what free gifts to add automatically"
      breadcrumbs={[{content: 'Dashboard', onAction: () => navigate('/')}]}
      primaryAction={{
        content: saving ? 'Saving...' : 'Save Settings',
        loading: saving,
        onAction: handleSave,
        disabled: saving
      }}
    >
      <Layout>
        {/* Status Messages */}
        {error && (
          <Layout.Section>
            <Banner status="critical" title="Error">
              <p>{error}</p>
            </Banner>
          </Layout.Section>
        )}

        {success && (
          <Layout.Section>
            <Banner status="success" title="Settings Saved">
              <p>Your free gift settings have been updated successfully!</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Main Settings Form */}
        <Layout.Section>
          <Card title="Gift Configuration" sectioned>
            <FormLayout>
              <TextField
                label="Threshold Amount ($)"
                type="number"
                value={settings.threshold_amount.toString()}
                onChange={(value) => handleFieldChange('threshold_amount', parseFloat(value) || 0)}
                helpText="Minimum cart value required to trigger the free gift"
                prefix="$"
                min="0"
                step="0.01"
              />

              <Select
                label="Gift Product"
                options={[
                  { value: '', label: 'Select a product...' },
                  ...products
                ]}
                value={settings.gift_product_id}
                onChange={(value) => handleFieldChange('gift_product_id', value)}
                helpText="Choose which product to give away for free"
              />

              {settings.gift_product_id && (
                <Select
                  label="Product Variant"
                  options={[
                    { value: '', label: 'Select a variant...' },
                    ...variants
                  ]}
                  value={settings.gift_variant_id}
                  onChange={(value) => handleFieldChange('gift_variant_id', value)}
                  helpText="Select the specific variant of the gift product"
                />
              )}

              <Checkbox
                label="Enable free gift feature"
                checked={settings.is_active}
                onChange={(checked) => handleFieldChange('is_active', checked)}
                helpText="Turn this on to start automatically adding gifts to qualifying carts"
              />
            </FormLayout>
          </Card>
        </Layout.Section>

        {/* Preview Section */}
        <Layout.Section>
          <Card title="Preview" sectioned>
            <Stack vertical spacing="loose">
              <Text variation="strong">How it will work:</Text>
              
              <Stack vertical spacing="tight">
                <Text>
                  ✅ When a customer's cart reaches <strong>${settings.threshold_amount}</strong>
                </Text>
                <Text>
                  🎁 The selected gift product will be automatically added
                </Text>
                <Text>
                  📈 This encourages customers to spend more to reach the threshold
                </Text>
              </Stack>

              {settings.is_active && settings.gift_product_id ? (
                <Banner status="success" title="Ready to Go!">
                  <p>Your free gift feature is configured and will be active once you save.</p>
                </Banner>
              ) : (
                <Banner status="info" title="Setup Required">
                  <p>Complete the configuration above and enable the feature to start boosting your sales.</p>
                </Banner>
              )}
            </Stack>
          </Card>
        </Layout.Section>

        {/* Tips Section */}
        <Layout.Section>
          <Card title="Pro Tips" sectioned>
            <Stack vertical spacing="loose">
              <Text>
                <strong>💡 Choose the Right Threshold:</strong> Set it 20-30% above your current average order value
              </Text>
              <Text>
                <strong>🎁 Pick Appealing Gifts:</strong> Small, branded items work best (keychains, stickers, samples)
              </Text>
              <Text>
                <strong>📊 Monitor Performance:</strong> Check analytics regularly to optimize your threshold
              </Text>
              <Text>
                <strong>🔄 Test Different Gifts:</strong> Try different products to see what drives the most conversions
              </Text>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Settings;