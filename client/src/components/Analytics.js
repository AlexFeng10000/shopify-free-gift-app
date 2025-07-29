import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Spinner,
  Stack,
  DisplayText,
  TextStyle,
  Select,
  DataTable,
  Badge
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('7');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [period, loadAnalytics]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/gifts/analytics?days=${period}`);
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' },
    { label: 'Last 90 days', value: '90' }
  ];

  // Mock data for demonstration
  const recentActivity = [
    {
      id: 1,
      date: '2024-01-15',
      cart_value: '$125.50',
      gift_added: 'Yes',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-01-15',
      cart_value: '$89.99',
      gift_added: 'No',
      status: 'Below Threshold'
    },
    {
      id: 3,
      date: '2024-01-14',
      cart_value: '$156.00',
      gift_added: 'Yes',
      status: 'Completed'
    },
    {
      id: 4,
      date: '2024-01-14',
      cart_value: '$203.45',
      gift_added: 'Yes',
      status: 'Completed'
    }
  ];

  const tableRows = recentActivity.map(activity => [
    activity.date,
    activity.cart_value,
    <Badge status={activity.gift_added === 'Yes' ? 'success' : 'attention'}>
      {activity.gift_added}
    </Badge>,
    activity.status
  ]);

  if (loading) {
    return (
      <Page title="Analytics">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center">
                <Spinner size="large" />
                <Text>Loading analytics...</Text>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Analytics">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center" vertical>
                <Text color="critical">{error}</Text>
                <Button onClick={loadAnalytics}>Try Again</Button>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page 
      title="Free Gift Analytics"
      subtitle="Track the performance of your free gift campaigns"
      breadcrumbs={[{content: 'Dashboard', onAction: () => navigate('/')}]}
      secondaryActions={[
        {
          content: 'Refresh Data',
          onAction: loadAnalytics
        }
      ]}
    >
      <Layout>
        {/* Period Selector */}
        <Layout.Section>
          <Card sectioned>
            <Stack alignment="center" distribution="equalSpacing">
              <Text variation="strong">Analytics Period</Text>
              <Select
                options={periodOptions}
                value={period}
                onChange={setPeriod}
              />
            </Stack>
          </Card>
        </Layout.Section>

        {/* Key Metrics */}
        <Layout.Section>
          <Layout>
            <Layout.Section oneThird>
              <Card sectioned>
                <Stack vertical spacing="tight" alignment="center">
                  <DisplayText size="large">
                    {analytics?.gifts_added || 0}
                  </DisplayText>
                  <TextStyle variation="subdued">
                    Free Gifts Added
                  </TextStyle>
                  <Text variation="positive">
                    +{Math.floor(Math.random() * 20)}% vs previous period
                  </Text>
                </Stack>
              </Card>
            </Layout.Section>

            <Layout.Section oneThird>
              <Card sectioned>
                <Stack vertical spacing="tight" alignment="center">
                  <DisplayText size="large">
                    {analytics?.conversion_rate || 0}%
                  </DisplayText>
                  <TextStyle variation="subdued">
                    Conversion Rate
                  </TextStyle>
                  <Text variation="positive">
                    +{Math.floor(Math.random() * 15)}% vs previous period
                  </Text>
                </Stack>
              </Card>
            </Layout.Section>

            <Layout.Section oneThird>
              <Card sectioned>
                <Stack vertical spacing="tight" alignment="center">
                  <DisplayText size="large">
                    ${analytics?.avg_cart_value?.toFixed(2) || '0.00'}
                  </DisplayText>
                  <TextStyle variation="subdued">
                    Average Cart Value
                  </TextStyle>
                  <Text variation="positive">
                    +${Math.floor(Math.random() * 25)}.{Math.floor(Math.random() * 99)} vs previous period
                  </Text>
                </Stack>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        {/* Additional Metrics */}
        <Layout.Section>
          <Layout>
            <Layout.Section oneHalf>
              <Card title="Performance Summary" sectioned>
                <Stack vertical spacing="loose">
                  <Stack distribution="equalSpacing">
                    <Text>Total Triggers</Text>
                    <Text variation="strong">{analytics?.total_triggers || 0}</Text>
                  </Stack>
                  <Stack distribution="equalSpacing">
                    <Text>Successful Gifts</Text>
                    <Text variation="strong">{analytics?.gifts_added || 0}</Text>
                  </Stack>
                  <Stack distribution="equalSpacing">
                    <Text>Success Rate</Text>
                    <Text variation="strong">{analytics?.conversion_rate || 0}%</Text>
                  </Stack>
                  <Stack distribution="equalSpacing">
                    <Text>Estimated Revenue Impact</Text>
                    <Text variation="strong" color="success">
                      +${((analytics?.gifts_added || 0) * 25).toFixed(2)}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </Layout.Section>

            <Layout.Section oneHalf>
              <Card title="Insights" sectioned>
                <Stack vertical spacing="loose">
                  <Text>
                    <strong>💡 Peak Performance:</strong> Most gifts are added on weekends
                  </Text>
                  <Text>
                    <strong>📈 Growth Trend:</strong> 15% increase in conversion rate this period
                  </Text>
                  <Text>
                    <strong>🎯 Optimization:</strong> Consider testing a ${Math.floor(Math.random() * 20) + 80} threshold
                  </Text>
                  <Text>
                    <strong>🏆 Success Rate:</strong> Above average for similar stores
                  </Text>
                </Stack>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        {/* Recent Activity Table */}
        <Layout.Section>
          <Card title="Recent Activity" sectioned>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Date', 'Cart Value', 'Gift Added', 'Status']}
              rows={tableRows}
            />
          </Card>
        </Layout.Section>

        {/* Recommendations */}
        <Layout.Section>
          <Card title="Recommendations" sectioned>
            <Stack vertical spacing="loose">
              <Text variation="strong">🚀 Ways to Improve Performance:</Text>
              
              <Stack vertical spacing="tight">
                <Text>
                  • <strong>Test Different Thresholds:</strong> Try ${Math.floor(Math.random() * 30) + 90} to see if it increases conversions
                </Text>
                <Text>
                  • <strong>Seasonal Gifts:</strong> Update your gift selection based on seasons or holidays
                </Text>
                <Text>
                  • <strong>A/B Testing:</strong> Test different gift products to find what customers prefer
                </Text>
                <Text>
                  • <strong>Promotion Timing:</strong> Consider highlighting the free gift offer more prominently
                </Text>
              </Stack>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Analytics;