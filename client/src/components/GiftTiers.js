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
  Text,
  Button,

  Icon,
  ResourceList,
  ResourceItem
} from '@shopify/polaris';
import {
  DeleteMajor,
  CirclePlusMajor,
  DragHandleMinor
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';

function GiftTiers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tiers, setTiers] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadTiers();
    loadProducts();
  }, []);

  const loadTiers = async () => {
    try {
      // Mock data for demo - in real app would fetch from API
      const mockTiers = JSON.parse(localStorage.getItem('giftTiers')) || [
        {
          id: 1,
          threshold_amount: 50,
          gift_product_id: 'prod_1',
          gift_variant_id: 'prod_1_var_1',
          gift_description: 'Free sticker pack',
          is_active: true
        },
        {
          id: 2,
          threshold_amount: 100,
          gift_product_id: 'prod_2',
          gift_variant_id: 'prod_2_var_1',
          gift_description: 'Free keychain',
          is_active: true
        }
      ];
      
      setTiers(mockTiers);
      setLoading(false);
    } catch (err) {
      console.error('Error loading tiers:', err);
      setError('Failed to load gift tiers');
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const mockProducts = [
        { value: 'prod_1', label: 'Sticker Pack - $0' },
        { value: 'prod_2', label: 'Branded Keychain - $0' },
        { value: 'prod_3', label: 'Mini Notebook - $0' },
        { value: 'prod_4', label: 'Phone Stand - $0' },
        { value: 'prod_5', label: 'Tote Bag - $0' }
      ];
      
      const mockVariants = {
        'prod_1': [
          { value: 'prod_1_var_1', label: 'Default' },
          { value: 'prod_1_var_2', label: 'Color Pack' }
        ],
        'prod_2': [
          { value: 'prod_2_var_1', label: 'Silver' },
          { value: 'prod_2_var_2', label: 'Gold' }
        ],
        'prod_3': [
          { value: 'prod_3_var_1', label: 'Blue' },
          { value: 'prod_3_var_2', label: 'Red' }
        ],
        'prod_4': [
          { value: 'prod_4_var_1', label: 'Black' },
          { value: 'prod_4_var_2', label: 'White' }
        ],
        'prod_5': [
          { value: 'prod_5_var_1', label: 'Canvas' },
          { value: 'prod_5_var_2', label: 'Cotton' }
        ]
      };
      
      setProducts(mockProducts);
      setVariants(mockVariants);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const addTier = () => {
    const newTier = {
      id: Date.now(), // Temporary ID
      threshold_amount: '',
      gift_product_id: '',
      gift_variant_id: '',
      gift_description: '',
      is_active: true
    };
    setTiers([...tiers, newTier]);
  };

  const removeTier = (index) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    setTiers(newTiers);
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // Clear variant when product changes
    if (field === 'gift_product_id') {
      newTiers[index].gift_variant_id = '';
    }
    
    setTiers(newTiers);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate tiers
      for (const tier of tiers) {
        if (!tier.threshold_amount || tier.threshold_amount <= 0) {
          throw new Error('All tiers must have a valid threshold amount');
        }
        
        if (tier.is_active && (!tier.gift_product_id || !tier.gift_variant_id)) {
          throw new Error('Active tiers must have a gift product and variant selected');
        }
      }

      // Check for duplicate thresholds
      const thresholds = tiers.map(t => parseFloat(t.threshold_amount));
      const uniqueThresholds = [...new Set(thresholds)];
      if (thresholds.length !== uniqueThresholds.length) {
        throw new Error('Each tier must have a unique threshold amount');
      }

      // Sort tiers by threshold amount
      const sortedTiers = [...tiers].sort((a, b) => 
        parseFloat(a.threshold_amount) - parseFloat(b.threshold_amount)
      );

      // Save to localStorage (simulating API call)
      localStorage.setItem('giftTiers', JSON.stringify(sortedTiers));
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTiers(sortedTiers);
      setSuccess(true);
      
      // Auto-navigate back to dashboard after successful save
      setTimeout(() => {
        navigate('/', { state: { refresh: true } });
      }, 1500);
      
    } catch (err) {
      console.error('Error saving tiers:', err);
      setError(err.message || 'Failed to save gift tiers');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Page title="Gift Tiers">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center">
                <Spinner size="large" />
                <Text>Loading gift tiers...</Text>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page 
      title="Gift Tiers"
      subtitle="Create multiple gift thresholds to maximize customer spending and boost average order value"
      breadcrumbs={[{content: 'Dashboard', onAction: () => navigate('/')}]}
      primaryAction={{
        content: saving ? 'Saving...' : 'Save All Tiers',
        loading: saving,
        onAction: handleSave,
        disabled: saving || tiers.length === 0
      }}
      secondaryActions={[
        {
          content: 'Add Tier',
          icon: CirclePlusMajor,
          onAction: addTier
        }
      ]}
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
            <Banner status="success" title="Tiers Saved">
              <p>Your gift tiers have been updated successfully!</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Instructions */}
        <Layout.Section>
          <Card title="How Gift Tiers Work" sectioned>
            <Stack vertical spacing="tight">
              <Text>
                <strong>Multiple Rewards:</strong> Customers can earn different gifts based on their spending level
              </Text>
              <Text>
                <strong>Automatic Qualification:</strong> All qualifying gifts are added when thresholds are met
              </Text>
              <Text>
                <strong>Increasing Value:</strong> Higher thresholds should offer more valuable gifts
              </Text>
              <Text variation="subdued">
                Example: $25 → Stickers, $50 → Keychain, $100 → Tote Bag
              </Text>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Gift Tiers List */}
        <Layout.Section>
          <Card title={`Gift Tiers (${tiers.length})`}>
            {tiers.length === 0 ? (
              <Card.Section>
                <Stack alignment="center" spacing="loose">
                  <Text variation="subdued">No gift tiers configured</Text>
                  <Button primary icon={CirclePlusMajor} onClick={addTier}>
                    Add Your First Tier
                  </Button>
                </Stack>
              </Card.Section>
            ) : (
              <ResourceList
                resourceName={{singular: 'tier', plural: 'tiers'}}
                items={tiers.map((tier, index) => ({...tier, index}))}
                renderItem={(item) => {
                  const { index } = item;
                  const tier = tiers[index];
                  
                  return (
                    <ResourceItem id={index}>
                      <Card sectioned>
                        <Stack distribution="fillEvenly" alignment="center">
                          <Stack vertical spacing="tight">
                            <Text variation="strong">Tier {index + 1}</Text>
                            <Stack spacing="tight">
                              <Icon source={DragHandleMinor} color="subdued" />
                              <Checkbox
                                label="Active"
                                checked={tier.is_active}
                                onChange={(checked) => updateTier(index, 'is_active', checked)}
                              />
                            </Stack>
                          </Stack>
                          
                          <FormLayout>
                            <FormLayout.Group>
                              <TextField
                                label="Threshold Amount"
                                type="number"
                                value={tier.threshold_amount.toString()}
                                onChange={(value) => updateTier(index, 'threshold_amount', parseFloat(value) || 0)}
                                prefix="$"
                                min="0"
                                step="0.01"
                              />
                              
                              <TextField
                                label="Description"
                                value={tier.gift_description}
                                onChange={(value) => updateTier(index, 'gift_description', value)}
                                placeholder="e.g., Free sticker pack"
                              />
                            </FormLayout.Group>
                            
                            <FormLayout.Group>
                              <Select
                                label="Gift Product"
                                options={[
                                  { value: '', label: 'Select product...' },
                                  ...products
                                ]}
                                value={tier.gift_product_id}
                                onChange={(value) => updateTier(index, 'gift_product_id', value)}
                              />
                              
                              {tier.gift_product_id && variants[tier.gift_product_id] && (
                                <Select
                                  label="Product Variant"
                                  options={[
                                    { value: '', label: 'Select variant...' },
                                    ...variants[tier.gift_product_id]
                                  ]}
                                  value={tier.gift_variant_id}
                                  onChange={(value) => updateTier(index, 'gift_variant_id', value)}
                                />
                              )}
                            </FormLayout.Group>
                          </FormLayout>
                          
                          <Button
                            destructive
                            icon={DeleteMajor}
                            onClick={() => removeTier(index)}
                            accessibilityLabel={`Remove tier ${index + 1}`}
                          />
                        </Stack>
                      </Card>
                    </ResourceItem>
                  );
                }}
              />
            )}
          </Card>
        </Layout.Section>

        {/* Preview */}
        {tiers.length > 0 && (
          <Layout.Section>
            <Card title="Customer Experience Preview" sectioned>
              <Stack vertical spacing="loose">
                <Text variation="strong">How customers will see your gift tiers:</Text>
                
                {tiers
                  .filter(tier => tier.is_active && tier.threshold_amount)
                  .sort((a, b) => a.threshold_amount - b.threshold_amount)
                  .map((tier, index) => (
                    <Stack key={index} alignment="center" spacing="tight">
                      <Text>💰 Spend <strong>${tier.threshold_amount}</strong></Text>
                      <Text>→</Text>
                      <Text>🎁 Get <strong>{tier.gift_description || 'Free Gift'}</strong></Text>
                    </Stack>
                  ))}
                
                {tiers.filter(tier => tier.is_active).length === 0 && (
                  <Text variation="subdued">No active tiers to preview</Text>
                )}
              </Stack>
            </Card>
          </Layout.Section>
        )}

        {/* Tips */}
        <Layout.Section>
          <Card title="Pro Tips for Gift Tiers" sectioned>
            <Stack vertical spacing="loose">
              <Text>
                <strong>💡 Start Small:</strong> Set your first tier 20-30% above average order value
              </Text>
              <Text>
                <strong>📈 Increase Value:</strong> Each tier should offer progressively better gifts
              </Text>
              <Text>
                <strong>🎯 Strategic Gaps:</strong> Leave meaningful gaps between tiers (e.g., $25, $50, $100)
              </Text>
              <Text>
                <strong>📊 Monitor Performance:</strong> Track which tiers drive the most conversions
              </Text>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default GiftTiers;