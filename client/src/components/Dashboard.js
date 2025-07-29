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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load settings and analytics in parallel
      const [settingsResponse, analyticsResponse] = await Promise.all([
        axios.get('/api/gifts/settings'),
        axios.get('/api/gifts/analytics?days=7')
      ]);

      setSettings(settingsResponse.data);
      setAnalytics(analyticsResponse.data);
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
                content: 'Settings',
                icon: SettingsMajor,
                onAction: () => navigate('/settings')
            }}
            secondaryActions={[
                {
                    content: 'View Analytics',
                    icon: AnalyticsMajor,
                    onAction: () => navigate('/analytics')
                }
            ]}
        >
            <Layout>
                {/* Status Banner */}
                <Layout.Section>
                    {!isConfigured ? (
                        <Banner
                            title="Setup Required"
                            status="warning"
                            action={{
                                content: 'Configure Now',
                                onAction: () => navigate('/settings')
                            }}
                        >
                            <p>Configure your free gift settings to start boosting sales!</p>
                        </Banner>
                    ) : !isActive ? (
                        <Banner
                            title="Free Gift Feature Disabled"
                            status="info"
                            action={{
                                content: 'Enable Now',
                                onAction: () => navigate('/settings')
                            }}
                        >
                            <p>Your free gift is configured but not active. Enable it to start adding gifts automatically.</p>
                        </Banner>
                    ) : (
                        <Banner title="Free Gift Active" status="success">
                            <p>🎉 Your free gift feature is active and working! Gifts will be added automatically when customers spend ${settings.threshold_amount} or more.</p>
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
                    <Card title="Current Configuration" sectioned>
                        <Stack vertical spacing="loose">
                            <Stack alignment="center" distribution="equalSpacing">
                                <Stack vertical spacing="extraTight">
                                    <Text variation="strong">Threshold Amount</Text>
                                    <Text>${settings?.threshold_amount || 'Not set'}</Text>
                                </Stack>
                                <Stack vertical spacing="extraTight">
                                    <Text variation="strong">Status</Text>
                                    <Badge status={isActive ? 'success' : 'attention'}>
                                        {isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Stack>
                            </Stack>

                            {settings?.gift_product_id ? (
                                <Stack vertical spacing="extraTight">
                                    <Text variation="strong">Gift Product</Text>
                                    <Text>Product ID: {settings.gift_product_id}</Text>
                                    <Text variation="subdued">Variant ID: {settings.gift_variant_id}</Text>
                                </Stack>
                            ) : (
                                <Stack vertical spacing="extraTight">
                                    <Text variation="strong">Gift Product</Text>
                                    <Text variation="subdued">No gift product selected</Text>
                                </Stack>
                            )}
                        </Stack>
                    </Card>
                </Layout.Section>

                {/* Quick Actions */}
                <Layout.Section>
                    <Card title="Quick Actions" sectioned>
                        <Stack distribution="fillEvenly">
                            <Button
                                primary
                                icon={CirclePlusMajor}
                                onClick={() => navigate('/settings')}
                            >
                                {isConfigured ? 'Update Settings' : 'Setup Free Gift'}
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
                    <Card title="How It Works" sectioned>
                        <Stack vertical spacing="loose">
                            <Text>
                                <strong>1. Set Threshold:</strong> Choose the minimum cart value (e.g., $100)
                            </Text>
                            <Text>
                                <strong>2. Select Gift:</strong> Pick a product to give away for free
                            </Text>
                            <Text>
                                <strong>3. Activate:</strong> Turn on the feature and watch your sales grow!
                            </Text>
                            <Text variation="subdued">
                                When customers reach your threshold, the free gift is automatically added to their cart.
                            </Text>
                        </Stack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Dashboard;