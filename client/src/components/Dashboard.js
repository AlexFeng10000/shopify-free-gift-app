import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Banner,
  Spinner,
  Stack,
  DisplayText,
  TextStyle,
  Badge,
  Icon
} from '@shopify/polaris';
import {
  GiftCardMajor,
  CirclePlusMajor,
  AnalyticsMajor,
  SettingsMajor
} from '@shopify/polaris-icons';
import { useNavigate, useLocation } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh data when navigating back from other pages
  useEffect(() => {
    if (location.state?.refresh) {
      loadDashboardData();
      // Clear the refresh flag
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const showUpdateSuccess = location.state?.refresh;

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get gift tiers from localStorage (simulating API)
      const savedTiers = localStorage.getItem('giftTiers');
      let mockTiers;
      
      if (savedTiers) {
        mockTiers = JSON.parse(savedTiers);
      } else {
        // Default mock data - single tier for backward compatibility
        mockTiers = [{
          id: 1,
          threshold_amount: 100,
          gift_product_id: 'prod_1',
          gift_variant_id: 'prod_1_var_1',
          gift_description: 'Free gift with $100+ purchase',
          is_active: true
        }];
      }
      
      // Convert to legacy format for existing components
      const legacySettings = {
        threshold_amount: mockTiers[0]?.threshold_amount || 100,
        gift_product_id: mockTiers[0]?.gift_product_id || 'prod_1',
        gift_variant_id: mockTiers[0]?.gift_variant_id || 'prod_1_var_1',
        is_active: mockTiers.some(tier => tier.is_active),
        tiers: mockTiers
      };
      
      const mockAnalytics = {
        gifts_added: 47,
        conversion_rate: 23.5,
        total_triggers: 200,
        avg_cart_value: 125.50
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSettings(legacySettings);
      setAnalytics(mockAnalytics);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
        return (
            <Page title="Free Gift Dashboard">
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <Stack alignment="center">
                                <Spinner size="large" />
                                <Text>Loading your dashboard...</Text>
                            </Stack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title="Free Gift Dashboard">
                <Layout>
                    <Layout.Section>
                        <Banner status="critical" title="Error">
                            <p>{error}</p>
                            <Button onClick={loadDashboardData}>Try Again</Button>
                        </Banner>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    const isConfigured = settings?.gift_product_id && settings?.threshold_amount;
    const isActive = settings?.is_active && isConfigured;

    return (
        <Page
            title="Free Gift Dashboard"
            subtitle="Automatically add free gifts to boost your average order value"
            primaryAction={{
                content: 'Manage Gift Tiers',
                icon: SettingsMajor,
                onAction: () => navigate('/gift-tiers')
            }}
            secondaryActions={[
                {
                    content: 'View Analytics',
                    icon: AnalyticsMajor,
                    onAction: () => navigate('/analytics')
                },
                {
                    content: 'Refresh',
                    onAction: loadDashboardData
                }
            ]}
        >
            <Layout>
                {/* Update Success Banner */}
                {showUpdateSuccess && (
                    <Layout.Section>
                        <Banner status="success" title="Settings Updated">
                            <p>Your free gift settings have been saved and are now active!</p>
                        </Banner>
                    </Layout.Section>
                )}

                {/* Status Banner */}
                <Layout.Section>
                    {!isConfigured ? (
                        <Banner
                            title="Setup Required"
                            status="warning"
                            action={{
                                content: 'Set Up Gift Tiers',
                                onAction: () => navigate('/gift-tiers')
                            }}
                        >
                            <p>Configure your gift tiers to start boosting sales with automatic free gifts!</p>
                        </Banner>
                    ) : !isActive ? (
                        <Banner
                            title="Gift Tiers Disabled"
                            status="info"
                            action={{
                                content: 'Enable Tiers',
                                onAction: () => navigate('/gift-tiers')
                            }}
                        >
                            <p>Your gift tiers are configured but not active. Enable them to start adding gifts automatically.</p>
                        </Banner>
                    ) : (
                        <Banner title="Gift Tiers Active" status="success">
                            <p>🎉 Your gift tiers are active and working! Customers will receive gifts automatically based on their spending levels.</p>
                        </Banner>
                    )}
                </Layout.Section>

                {/* Quick Stats */}
                <Layout.Section>
                    <Layout>
                        <Layout.Section oneHalf>
                            <Card>
                                <Card.Section>
                                    <Stack alignment="center" spacing="tight">
                                        <Icon source={GiftCardMajor} color="success" />
                                        <Stack vertical spacing="extraTight">
                                            <DisplayText size="medium">
                                                {analytics?.gifts_added || 0}
                                            </DisplayText>
                                            <TextStyle variation="subdued">
                                                Free gifts added (7 days)
                                            </TextStyle>
                                        </Stack>
                                    </Stack>
                                </Card.Section>
                            </Card>
                        </Layout.Section>

                        <Layout.Section oneHalf>
                            <Card>
                                <Card.Section>
                                    <Stack alignment="center" spacing="tight">
                                        <Icon source={AnalyticsMajor} color="highlight" />
                                        <Stack vertical spacing="extraTight">
                                            <DisplayText size="medium">
                                                {analytics?.conversion_rate || 0}%
                                            </DisplayText>
                                            <TextStyle variation="subdued">
                                                Gift conversion rate
                                            </TextStyle>
                                        </Stack>
                                    </Stack>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Layout.Section>

                {/* Current Configuration */}
                <Layout.Section>
                    <Card title={`Gift Configuration (${settings?.tiers?.length || 0} tiers)`} sectioned>
                        {settings?.tiers && settings.tiers.length > 0 ? (
                            <Stack vertical spacing="loose">
                                {settings.tiers
                                    .sort((a, b) => a.threshold_amount - b.threshold_amount)
                                    .map((tier, index) => (
                                    <Stack key={tier.id || index} alignment="center" distribution="equalSpacing">
                                        <Stack vertical spacing="extraTight">
                                            <Text variation="strong">Tier {index + 1}</Text>
                                            <Text>${tier.threshold_amount}</Text>
                                        </Stack>
                                        <Stack vertical spacing="extraTight">
                                            <Text variation="strong">Gift</Text>
                                            <Text>{tier.gift_description || 'Free Gift'}</Text>
                                        </Stack>
                                        <Stack vertical spacing="extraTight">
                                            <Text variation="strong">Status</Text>
                                            <Badge status={tier.is_active ? 'success' : 'attention'}>
                                                {tier.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        ) : (
                            <Stack alignment="center" spacing="loose">
                                <Text variation="subdued">No gift tiers configured</Text>
                                <Button primary onClick={() => navigate('/gift-tiers')}>
                                    Set Up Gift Tiers
                                </Button>
                            </Stack>
                        )}
                    </Card>
                </Layout.Section>

                {/* Quick Actions */}
                <Layout.Section>
                    <Card title="Quick Actions" sectioned>
                        <Stack distribution="fillEvenly">
                            <Button
                                primary
                                icon={CirclePlusMajor}
                                onClick={() => navigate('/gift-tiers')}
                            >
                                {isConfigured ? 'Manage Gift Tiers' : 'Setup Gift Tiers'}
                            </Button>

                            <Button
                                icon={AnalyticsMajor}
                                onClick={() => navigate('/analytics')}
                            >
                                View Detailed Analytics
                            </Button>
                        </Stack>
                    </Card>
                </Layout.Section>

                {/* Help Section */}
                <Layout.Section>
                    <Card title="How Gift Tiers Work" sectioned>
                        <Stack vertical spacing="loose">
                            <Text>
                                <strong>1. Create Multiple Tiers:</strong> Set different spending thresholds (e.g., $25, $50, $100)
                            </Text>
                            <Text>
                                <strong>2. Assign Gifts:</strong> Choose what free product customers get at each level
                            </Text>
                            <Text>
                                <strong>3. Activate Tiers:</strong> Turn on the tiers and watch your average order value grow!
                            </Text>
                            <Text variation="subdued">
                                Customers automatically receive ALL gifts they qualify for based on their cart total.
                            </Text>
                        </Stack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Dashboard;